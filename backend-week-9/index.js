import express from "express";
import jwt from "jsonwebtoken";


const app = express();
app.use(express.json());

const JWT_SECRET = "your_secret_key";


const notes = [];

const users = [];

function authenticateJWT(req, res, next) {
const authHeader = req.headers.authorization;
const bearerToken = typeof authHeader === "string" && authHeader.startsWith("Bearer ")
    ? authHeader.slice(7).trim()
    : null;
const fallbackToken = typeof req.headers.token === "string" ? req.headers.token : null;
const token = bearerToken || fallbackToken;

if (!token) {
    return res.status(401).json({ message: "Token is required" });
}

try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
} catch (error) {
    return res.status(401).json({ message: "Invalid token" });
}
}


app.post("/signup", function(req, res){
const username = req.body?.username;
const password = req.body?.password;
if (typeof username !== "string" || username.trim() === "") {
    return res.status(400).json({ message: "Invalid username" });   
}

if (typeof password !== "string" || password.trim() === "") {
    return res.status(400).json({ message: "Invalid password" });
}

if (users.some((user) => user.username === username.trim())) {
    return res.status(403).json({ message: "Username already exists" });    
}

users.push({ username: username.trim(), password: password.trim() });
res.json({message: "User signed up successfully"});


});


app.post("/login", function(req, res){
const { username, password } = req.body;

if (typeof username !== "string" || typeof password !== "string" || username.trim() === "" || password.trim() === "") {
    return res.status(400).json({ message: "Invalid username or password" });
}

const user = users.find(user => user.username === username.trim() && user.password === password.trim());

if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
}
const token = jwt.sign({ username: user.username }, JWT_SECRET, { expiresIn: "1h" });
res.json({ message: "Login successful", token: token });
});

app.post("/notes", authenticateJWT, function(req, res){
const note = req.body?.note;

if (typeof note !== "string" || note.trim() === "") {
    return res.status(400).json({ message: "Invalid note" });
}

notes.push(note.trim());
res.json({message: "Note added successfully"});

});

app.get("/notes", authenticateJWT, function(req, res){

res.json({notes: notes});
});

app.delete("/notes", authenticateJWT, function(req, res){
notes.length = 0;
res.json({message: "All notes deleted successfully"});
});


app.get("/", function(req, res){
    res.sendFile("/Users/chawla/Documents/Harkirat 100x Bootcamp/backend-week-9/frontend/index.html");
});



app.listen(3000, () => {
    console.log("Server is running on port 3000");
});