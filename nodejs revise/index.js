import fs from "fs"

fs.readFile("./files/input.txt", "utf-8", (err, data) => {
  console.log(data);
  fs.readFile(`./files/${data}.txt`,"utf-8", (err1, data1) => {

    console.log(data1);
    console.log(err1);
  });
});
console.log("mts");


