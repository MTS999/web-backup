const jsonString = '{"name": "John", "age": 30, "city": "New York"}';
const jsObject = JSON.parse(jsonString);

console.log(jsObject);

const mts=JSON.stringify(jsObject);
console.log(mts);
const jsObject1 = JSON.parse(mts);
console.log(jsObject1);