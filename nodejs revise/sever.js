const http=require("http")
const fs=require("fs")
 const html=fs.readFileSync("./Templete/index.html","utf-8")
const server=http.createServer((request,response)=>{
    response.end(html)
})


server.listen(3003,"127.0.0.1",()=>{
    console.log("started");
})