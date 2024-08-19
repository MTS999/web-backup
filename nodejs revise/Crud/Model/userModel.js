const mongoose = require("mongoose");
const validator=require("validator");
const { validate } = require("./movieModel");
const bcrypt = require("bcryptjs");
const crypto=require("crypto")

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "name is required"],
  },
  email: {
    type: String,
    required: [true, "email is required"],
    unique: [true, "email should be true"],
    lowercase: true,
    validate:[validator.isEmail,"please enter hte valid email"]
  },
  role:{
    type:String,
    enum:["user","admin"],
    default:'user'
  },
  password: {
    type: String,
    required: [true, "password is required"],
    minlength:8,
    select:false
  },
  confirmPassword: {
    type: String,
    required: [true, "please confirm your password "],
    minlength:8,
    validate:{
        validator:function(val){
           return val===this.password
        },
        message:"Password and confirm password does not match"
    }
  },
  passwordChangedAt:{
    type:Date
  },
  passwordResetToken:{
    type:String
  },
  passwordResetTokenExpireTime:Date

});
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
  
    // Encrypt the password before saving it
    this.password = await bcrypt.hash(this.password, 12);
  
    // Remove the confirmPassword field
    this.confirmPassword = undefined;
    next();
  });
  userSchema.methods.comparePasswordInDb= async function(pswd,pswdDb){
    return await bcrypt.compare(pswd,pswdDb)
  }

  userSchema.methods.createresetPasswordToken=function(){
    const resetToken=crypto.randomBytes(32).toString("hex")
    this.passwordResetToken= crypto.createHash("sha256").update(resetToken).digest("hex")
    this.passwordResetTokenExpireTime=Date.now() + 10*60*1000


    console.log(resetToken);
    console.log(this.passwordResetToken);
    return resetToken
    // return this.passwordResetToken
  }
const User=  mongoose.model("User",userSchema)
module.exports=User