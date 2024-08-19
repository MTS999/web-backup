const CustomError = require("../utils/CustomError");

const devErrors = (res, error) => {
  res.status(error.statusCode).json({
    status: error.statusCode,
    message: error.message,
    stackTrace: error.stack,
    error: error,
    mts: error.name,
  });
};
const prodErrors = (res, error) => {
  if (error.isOperational) {
    res.status(error.statusCode).json({
      status: error.statusCode,
      message: error.message,
    });
  } else {
    res.status(500).json({
      status: "error",
      message: "something went wrong! please try agian later",
    });
  }
};

castErrorHandler = (error) => {
  const msg = `invalid  value ${error.value} for field ${error.path}`;
  return new CustomError(msg, 400);
};
DublicateErrorHandler = (error) => {
  const name = error.keyValue.name;
  const msg = `there is alreaady a movie with name ${name} Please use anothere name`;

  return new CustomError(msg, 400);
};
ValidatioErrorHandler = (error) => {
  const errors = Object.values(error.errors).map((val) => val.message);
  const errorMesseages = errors.join(".==");
  const msg = `invalid input data ${errorMesseages} `;

  return new CustomError(msg, 400);
};
ExpiredJWTHandler = (error) => {
  const msg = `JWT expired Please login again`;

  return new CustomError(msg, 401);
};
InvalidTokenHandler = (error) => {
  const msg = `JWT token is invalid, Please login again`;

  return new CustomError(msg, 401);
};
module.exports = (error, req, res, next) => {
  error.statusCode = error.statusCode || 500;
  error.status = error.status || "error";

  if (process.env.NODE_ENV === "development") {
    devErrors(res, error);
  } else if (process.env.NODE_ENV === "production") {
    console.log(error);
    if (error.name === "CastError") {
      error = castErrorHandler(error);
    }
    if (error.code === 11000) {
      error = DublicateErrorHandler(error);
      console.log("mts");
    }
    if (error.name === "ValidationError") {
      error = ValidatioErrorHandler(error);
      console.log("mts");
    }
    if (error.name === "TokenExpiredError") {
      error = ExpiredJWTHandler(error);
      console.log("mts");
    }
    if (error.name === "JsonWebTokenError") {
      error = InvalidTokenHandler(error);
      console.log("mts");
    }
    prodErrors(res, error);
  }
};
