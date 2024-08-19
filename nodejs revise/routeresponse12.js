const http = require("http");
const fs = require("fs");
const html = fs.readFileSync("./Templete/index.html", "utf-8");
const server = http.createServer((request, response) => {
  const path = request.url;
  console.log(path);
  if (path == "/") {
    response.writeHead(230);
    response.end("home");
  } else if (path === "/about") {
    response.writeHead(200);
    response.end(html);
  } else {
    response.writeHead(404);

    response.end("not found");
  }
});

server.listen(3008, "127.0.0.1", () => {
  console.log("started");
});
