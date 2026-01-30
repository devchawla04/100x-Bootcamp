// I/O heavy operation (Input/Output heavy operation)

//Example: Reading a large file from disk
// HTTP requests to fetch data from an API
// Database queries to retrieve large datasets
// File uploads and downloads
// Network operations like sending/receiving data over sockets
// Starting a clock



// I/O Bound tasks
// way to read txt files 
// const fs = require("fs");
import fs from "fs";

const contents = fs.readFileSync("a.txt","utf-8");
console.log(contents);

const contents2 = fs.readFileSync("b.txt","utf-8");
console.log(contents2);


// CPU Bound tasks
let ans = 0;
for(let i =0;i<10000000000;i++){
    ans = ans + 1;
}
console.log(ans);


//Asynchronous I/O Operations
fs.readFile("a.txt","utf-8",function(error,contents){
    console.log(contents);
})
// CPU Bound tasks
let ans1 = 0;
for(let i =0;i<10000000000;i++){
    ans1 = ans1 + 1;
}
console.log(ans1);



//functional arguments
//Approach - 1
// function sum(a, b) {
//   return a + b;
// }

// function multiply(a, b) {
//   return a * b;
// }

// function subtract(a, b) {
//   return a - b;
// }

// function divide(a, b) {
//   return a / b;
// }

// function doOperation(a, b, op) {
//   return op(a, b)
// }

// console.log(sum(1, 2))


//Approach - 2
function sum1(a, b) {
  return a + b;
}

function multiply(a, b) {
  return a * b;
}

function subtract(a, b) {
  return a - b;
}

function divide(a, b) {
  return a / b;
}

function doOperation(a, b, op) {
  return op(a, b)
}

console.log(doOperation(1, 2, sum1))


//setTimeout

function run()
{
    console.log("I will run after is")
}


setTimeout(run,3000);
console.log("this is I");











