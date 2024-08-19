const express = require("express");
const morgan = require("morgan");
const rateLimit=require("express-rate-limit")

// import CustomError from "./utils/CustomError";
const CustomError=require("./utils/CustomError")
const globaleErrorHandler=require("./Controllers/errorControllers")
let app = express();
let limiter=rateLimit({
  max:4,
  windowMs:60*60*1000,
  message:"we hsve received too many requests from this ip,please try after one hour"
})
app.use("/api",limiter)
const movieRouter=require("./Routes/movieRoute")
const authRouter=require("./Routes/authRouter")
app.use(express.json());
app.use(express.static("./public"))
app.use(morgan("dev"))
// app.use((req,res,next)=>{
//     req.requesttime=new Date().toISOString()
//     next()
// })






  app.use("/api/movies",movieRouter)
  app.use("/api/users",authRouter)
  // app.all('*', (req, res, next) => {
  //   res.status(404).json({
  //     status: 'fail',
  //     message: `Can't find ${req.originalUrl} on the server!`
  //   });
  // });
  app.all('*', (req, res, next) => {
    // res.status(404).json({
    //     status: 'fail',
    //     message: 'Can't find ${req.originalUrl} on the server!'
    // });

    // const err = new Error(`Can't find ${req.originalUrl} on the server`);
    // err.status = 'fail';
    // err.statusCode = 404;
    const err = new CustomError(`Can't find ${req.originalUrl} on the server`, 404);


    next(err);
});

app.use(globaleErrorHandler);


  module.exports=app



