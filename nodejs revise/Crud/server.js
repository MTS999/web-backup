const dotenv=require("dotenv")
dotenv.config({path:"./config.env"})
const mongoose=require("mongoose")

const app=require("./index")
const port=process.env.PORT  ||3000
process.on("uncaughtException",(err)=>{
  console.log(err.name,err.message)
  console.log("shutting down")
  process.exit(1)
})
// mongoose.connect(process.env.CON_STR_COMPASS,{
mongoose.connect(process.env.CON_STR_COMPASS,{
  // useNewUrlParser:true
}).then((conn)=>{
  // console.log(conn);
  // console.log("succesfu");

})
// console.log(app.get("env"));
const server=app.listen(port, () => {
  console.log(`${port} is started`);
});

process.on("unhandledRejection",(err)=>{
  console.log(err.name,err.message)
  console.log("shutting down")
  server.close()
  process.exit(1)
})


