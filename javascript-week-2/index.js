
let name = "John";     // Variable that can be reassigned
const age = 30;        // Constant variable that cannot be reassigned
var isStudent = true;  // Older way to declare variables, function-scoped

let number = 42;             // Number
let string = "Hello World";  // String
let isActive = false;        // Boolean
let numbers = [1, 2, 3];     // Array

let addition = 10 + 5;          // Arithmetic operator
let isEqual = (10 === 10); // Comparison operator
let isTrue = (true && false); // Logical operator

// Function declaration
function greet(name) {
    return "Hello, " + name;
}

// Function call
let message = greet("John"); // "Hello, John"


function sumOfTwoNumber(a,b){
    return a + b;
}

let result = sumOfTwoNumber(5, 10); 

function sum(num){
    let sum = 0;
    for(let i = 1; i <= num; i++){
        sum += i;
    }
    return sum;
}

console.log("Sum:", sum(2)); 

function canVote(age){
    return age >= 18;
}

let votingStatus = canVote(19); 
console.log("Can Vote:", votingStatus);


if (age >= 18) {
    console.log("You are an adult.");
} else {
    console.log("You are a minor.");
}

function isOddOrEven(number) {
    if (number % 2 !== 0) {
        return "The number is odd.";
    } else {
        return "The number is even.";
    }
}
let check = isOddOrEven(2);
console.log(check);


// For loop
for (let i = 0; i < 5; i++) {
    console.log(i); // Outputs 0 to 4
}

// While loop
let j = 0;
while (j < 5) {
    console.log(j); // Outputs 0 to 4
    j++;
}



let color = "black";
let height = 182;
let likePizza = true;


console.log("Color:", color);
console.log("Height:", height);
console.log("Likes Pizza:", likePizza);





//complex types


let user1 = {
    name: "Dev",
    age: 22,
}
console.log("User Name:", user1.name);
console.log("User Age:", user1.age);


function user(user){
    return "Welcome back, " + user.name + "!" + " You are " + user.age + " years old.";
}

console.log(user(user1));


function greetUser(user){
    return `Hi ${user.gender === "male" ? "Mr." : "Mrs"}, ${user.name}! You are ${user.age} years old. ${user.age >= 18 ? "You are allowed to vote." : "You are not allowed to vote."}`;
}

console.log(greetUser({name: "Dev", age: 22, gender: "male"}));


// const users = ["harkirat", "raman", "diljeet"];
// const totalUsers = users.length;
// const firstUser = users[0];


function filterEvenNumbers(numbers){
    return numbers.filter(num => num % 2 === 0);
}

console.log(filterEvenNumbers([1,2,4,5,6,7,8]))



const users = [{
		name: "Harkirat",
		age: 16,
        gender: "male"
	},
     {
		name: "raman",
		age: 22,
        gender: "male"
	}, 
    {
        name: "palak",  
        age: 18,
        gender: "female"
    }
];

function getAdultUsers(users){
    return users.filter(user => user.age >= 18 && user.gender === "male");
}

console.log(getAdultUsers(users));

const user01 = users[0] 
const user01Age = users[0].age
