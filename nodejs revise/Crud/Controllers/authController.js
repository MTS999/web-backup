const express = require("express");
const User = require("../Model/userModel");
const asyncErrorHandler = require("../utils/asyncErrorHandler");
const jwt = require("jsonwebtoken");
const CustomError = require("../utils/CustomError");
const util = require("util");
const { request } = require("http");
const crypto = require("crypto");
const sendEmail = require("../utils/email");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.SECRET_KEY, {
    expiresIn: process.env.LOGIN_EXPIRES,
  });
};

const creartSendRespons = (user, statusCode, response) => {
  const token = signToken(user._id);
  const option={
    maxAge:process.env.LOGIN_EXPIRES,
    httpOnly:true
  }
  if(process.env.NODE_ENV==="production"){

    option.secure=true
  }
  response.cookie("jwt",token,option)
  user.password=undefined
  response.status(statusCode).json({
    status: "succes",
    token,
    data: {
      user
    },
  });
};

exports.signup = asyncErrorHandler(async (request, response, next) => {
  const newUser = await User.create(request.body);
  creartSendRespons(newUser,201,response)
});

exports.login = asyncErrorHandler(async (request, response, next) => {
  const { email, password } = request.body;
  if (!email || !password) {
    const err = new CustomError(
      "Please provide eamil and pasword for login",
      400
    );
    return next(err);
  }
  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.comparePasswordInDb(password, user.password))) {
    const err = new CustomError("incorrect email and password", 400);
    return next(err);
  }
  creartSendRespons(user,200,response)

});

exports.protect = asyncErrorHandler(async (request, response, next) => {
  const testToken = request.headers.authorization; // Changed to lowercase
  let token;

  if (testToken && testToken.startsWith("Bearer")) {
    token = testToken.split(" ")[1];
  }
  console.log(token);
  if (!token) {
    const err = new CustomError("You are not login ", 401);
    return next(err);
  }

  const decodedToken = await util.promisify(jwt.verify)(
    token,
    process.env.SECRET_KEY
  );
  console.log(decodedToken);

  const user = await User.findById(decodedToken.id);

  if (!user) {
    error = new CustomError("user with this token does not exist", 401);
    return next(err);
  }

  request.user = user;
  next();
});

exports.restrict = (role) => {
  return (request, response, next) => {
    if (request.user.role !== role) {
      error = new CustomError("you are not able to perform this task", 403);
      return next(error);
    }
    next();
  };
};

exports.forgotPassword = asyncErrorHandler(async (request, response, next) => {
  const user = await User.findOne({ email: request.body.email });
  if (!user) {
    error = new CustomError("user with this email does not exist", 404);
    return next(error);
  }

  const resetToken = user.createresetPasswordToken();
  await user.save({ validateBeforeSave: false });
  const resetUrl = `${request.protocol}:${request.get(
    "host"
  )}/api/users/passwordreset/${resetToken}`;
  const message = `we  have received a passwrd reset request,please the below link to reset your password\n\n ${resetUrl}`;
  try {
    await sendEmail({
      email: user.email,
      subject: "password changed request received",
      message: message,
    });
    response.status(200).json({
      status: "success",
      message: "password reset link is send to user email",
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpireTime = undefined;
    user.save({ validateBeforeSave: false });
    return next(
      new CustomError(
        "there was an error to sending reset password emailm,please try again later",
        500
      )
    );
  }
});
exports.resetPassword = asyncErrorHandler(async (req, res, next) => {
  // 1. IF THE USER EXISTS WITH THE GIVEN TOKEN & TOKEN HAS NOT EXPIRED
  const token = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");
  // const token = req.params.token
  const user = await User.findOne({
    passwordResetToken: token,
    passwordResetTokenExpireTime: { $gt: Date.now() },
  });

  if (!user) {
    const error = new CustomError("Token is invalid or has expired!", 400);
    return next(error);
  }

  // 2. RESETTING THE USER PASSWORD
  user.password = req.body.password;
  user.confirmPassword = req.body.confirmPassword;
  user.passwordResetToken = undefined;
  user.passwordResetTokenExpireTime = undefined;
  user.passwordChangedAt = Date.now();

  await user.save();

  creartSendRespons(user,200,response)

});

exports.updatePassword = asyncErrorHandler(async (request, response, next) => {
  const user = await User.findById(request.user._id).select("+password");
  if (!user) {
    error = new CustomError("user with this token does not exist", 401);
    return next(err);
  }
  console.log(user);
  console.log("Old Password:", request.body.oldPassword);
  console.log("User Password:", user.password);
  if (
    !(await user.comparePasswordInDb(request.body.oldPassword, user.password))
  ) {
    const error = new CustomError("your old password is not correct", 400);
    return next(error);
  }

  user.password = request.body.password;
  user.confirmPassword = request.body.confirmPassword;
  user.save();
  creartSendRespons(user,200,response)

});
