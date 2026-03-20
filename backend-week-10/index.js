import express from "express";
import  jwt from "jsonwebtoken";
import { authMiddleware } from "./middleware.js";


let USERS_ID = 1;
let ORGS_ID = 1;
let BOARDS_ID = 1;
let ISSUES_ID = 1;
const JWT_SECRET = "jwt-secret-key";
const users = [
  {
    id: 1,
    username: "harkirat",
    password: "123123",
  },
  {
    id: 2,
    username: "raman",
    password: "123123",
  },
];

const organisations = [
  {
    id: 1,
    title: "100xdevs",
    description: "Learning coding platform",
    admin: 1,
    members: [2],
  },
  {
    id: 2,
    title: "raman orgs",
    description: "Experimenting",
    admin: 1,
    members: [],
  },
];

const boards = [
  {
    id: 1,
    title: "100xschool website",
    organisations: 1,
  },
];

const issues = [
  {
    id: 1,
    title: "add dark mode",
    boardId: 1,
    state: "IN_PROGRESS",
  },
  {
    id: 2,
    title: "allow more buttons",
    boardId: 1,
    state: "DONE",
  },
];

const app = express();

app.use(express.json());

app.post("/signup", function(req, res) {
    const username = req.body.username;  
    const password = req.body.password;
    const userExists = users.find(user => user.username === username);
    if (userExists) {
        return res.status(411).json({
            message: "User with this username already exists"
        })
    }

    users.push({
        username: username, 
        password: password,
        id: USERS_ID++
    })

    res.json({
        message: "You have signed up"
    })
})

app.post("/signin", function(req, res) {
    const username = req.body.username;
    const password = req.body.password;

    const userExists = users.find(user => user.username === username && user.password === password);

    if (!userExists) {
        res.status(403).json({
            message: "Incorrect credentials"
        })
        return;
    }
    
    // json web tokens
    const token = jwt.sign({
        userID: userExists.id
    }, JWT_SECRET);

    res.json({
      token: token
    })
})

app.post("/organization",authMiddleware,(req,res) => {
const userId = req.userID;
organisations.push({
    id: ORGS_ID++,
    title: req.body.title,
    description: req.body.description,
    admin: userId,
    members: [] 
})
res.json({
    message: "Organization created successfully",
    id: ORGS_ID - 1
})
})
app.post("/add-member-to-organization",authMiddleware,(req,res) => {
    const userId = req.userID;
    const orgId = req.body.orgId;
    const memberUsername = req.body.memberId;

    const org = organisations.find(org => org.id === orgId);

    if (!org || org.admin !== userId) {
        res.status(404).json({
            message: "Organization not found or you are not the admin"
        })
        return;
    }

    const memberUser = users.find(user => user.username === memberUsername);
    
    if (!memberUser) {
        res.status(404).json({
            message: "User with this email not found"
        })
        return;
    }
    if (org.members.includes(memberUser.id)) {
        res.status(404).json({
            message: "User is already a member of the organization"
        })
        return;
    }
    org.members.push(memberUser.id);

    res.json({
        message: "Member added successfully"
    })

})
app.post("/board",(req,res) => {

})
app.post("/issue",(req,res) => {

})


app.get("/organizations",authMiddleware,(req,res) => {

    const userId = req.userID;
    const oraganizationId = req.query.organizationId;

    const org = organisations.find(org => org.id === parseInt(oraganizationId));
    
   if (!org || org.admin !== userId) {
        res.status(404).json({
            message: "Organization not found or you are not a member"
        })
        return;
    }

    res.json({
        organization: {
            ...org,
            members: org.members.map(memberId => {
                const user = users.find(user => user.id === memberId);
                return {
                    id: user.id,
                    username: user.username
                }
            })
        }
    })  

})

app.get("/boards",(req,res) => {

})
app.get("/issues",(req,res) => {

})
app.get("/members",(req,res) => {

})

app.put("/issues",(req,res) => {

})

app.delete("/members",authMiddleware,(req,res) => {
 const userId = req.userID;
    const orgId = req.body.orgId;
    const memberUsername = req.body.memberId;

    const org = organisations.find(org => org.id === orgId);

    if (!org || org.admin !== userId) {
        res.status(404).json({
            message: "Organization not found or you are not the admin"
        })
        return;
    }

    const memberUser = users.find(user => user.username === memberUsername);
    
    if (!memberUser) {
        res.status(404).json({
            message: "User with this email not found"
        })
        return;
    }
    if (!org.members.includes(memberUser.id)) {
        res.status(404).json({
            message: "User is not a member of the organization"
        })
        return;
    }
    org.members = org.members.filter(id => id !== memberUser.id);

    res.json({
        message: "Members updated successfully"
    })

})

app.listen(3000, function () {
  console.log("Server is running on 3000");
});
