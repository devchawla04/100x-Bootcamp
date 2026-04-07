const express = require("express");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const cors = require("cors");
const { authMiddleware } = require("./middleware")
const {userModel, organizationModel, boardModel, issueModel} = require("./models");


const app = express();
app.use(cors());
app.use(express.json());

// CREATE
app.post("/signup", async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    const userExists = await userModel.findOne({
        username: username,
    });

    if (userExists) {
        res.status(411).json({
            message: "User with this username already exists"
        })
        return;
    }

    const newUser = await userModel.create({
        username: username,
        password: password
    })

    res.json({
        id: newUser._id,
        message: "You have signed up successfully"
    })
})

app.post("/signin", async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    const userExists = await userModel.findOne({
        username: username,
        password: password
    });

    if (!userExists) {
        res.status(403).json({
            message: "Incorrect credentials"
        })
        return;
    }

    const token = jwt.sign({
        userId: userExists.id
    }, "secret123123");

    res.json({
        token
    })
})

// AUTHENTICATED ROUTE - MIDDLEWARE
app.post("/organization", authMiddleware, async (req, res) => {
    const userId = req.userId;

    const newOrg = await organizationModel.create({
        title: req.body.title,
        description: req.body.description,
        admin: userId,
        members: []
    })

    res.json({
        message: "Org created",
        id: newOrg._id
    })
})

app.post("/add-member-to-organization", authMiddleware, async (req, res) => {
    const userId = req.userId;
    const organizationId = req.body.organizationId;
    const memberUsername = req.body.memberUsername; 

    // const organization = ORGANIZATIONS.find(org => org.id === organizationId);
    const organization = await organizationModel.findOne({
        _id: organizationId
    });

    if (!organization || organization.admin.toString() !== userId) {
        res.status(411).json({
            message: "Either this org doesnt exist or you are not an admin of this org"
        })
        return
    }

    const memberUser = await userModel.findOne({
        username: memberUsername
    })

    if (!memberUser) {
        res.status(411).json({
            message: "No user with this username exists in our db"
        })
        return
    }

    organization.members.push(memberUser._id)
    await organization.save()

    res.json({
        message: "New member added!"
    })
})

app.post("/board", authMiddleware, async (req, res) => {
    const userId = req.userId;
    const organizationId = req.body.organizationId;
    const title = req.body.title;

    if (!mongoose.Types.ObjectId.isValid(organizationId)) {
        res.status(400).json({
            message: "Invalid organization id"
        })
        return
    }

    const organization = await organizationModel.findOne({
        _id: organizationId
    });

    if (!organization || organization.admin.toString() !== userId) {
        res.status(411).json({
            message: "Either this org doesnt exist or you are not an admin of this org"
        })
        return
    }

    const newBoard = await boardModel.create({
        title: title,
        organizationId: organization._id,
        createdBy: userId
    })

    res.json({
        message: "Board created",
        id: newBoard._id
    })
})

app.post("/issue", authMiddleware, async (req, res) => {
    const userId = req.userId;
    const boardId = req.body.boardId;
    const title = req.body.title;
    const state = req.body.state;

    if (!mongoose.Types.ObjectId.isValid(boardId)) {
        res.status(400).json({
            message: "Invalid board id"
        })
        return
    }

    const board = await boardModel.findOne({
        _id: boardId
    });

    if (!board) {
        res.status(411).json({
            message: "Board not found"
        })
        return
    }

    const organization = await organizationModel.findOne({
        _id: board.organizationId
    });

    const isAdmin = organization && organization.admin.toString() === userId;
    const isMember = organization && organization.members.some(m => m.toString() === userId);

    if (!organization || (!isAdmin && !isMember)) {
        res.status(403).json({
            message: "You are not part of this organization"
        })
        return
    }

    const issueData = {
        title: title,
        boardId: board._id,
        createdBy: userId
    }

    if (state) {
        issueData.state = state
    }

    const newIssue = await issueModel.create(issueData)

    res.json({
        message: "Issue created",
        id: newIssue._id
    })
})

//GET endpoints
app.get("/organization", authMiddleware, async (req, res) => {
    const userId = req.userId;
    const organizationId = req.query.organizationId;

    const organization = await organizationModel.findOne({
        _id: organizationId
    });

    if (!organization || organization.admin.toString() !== userId) {
        res.status(411).json({
            message: "Either this org doesnt exist or you are not an admin of this org"
        })
        return
    }

    const members = await userModel.find({
        _id: organization.members
    })

    res.json({
        organization: {
            title: organization.title,
            description: organization.description,
            members: members.map(m => ({
                username: m.username,
                id: m._id
            }))
        }
    })
})

app.get("/boards", authMiddleware, async (req, res) => {
    const userId = req.userId;
    const organizationId = req.query.organizationId;

    if (!mongoose.Types.ObjectId.isValid(organizationId)) {
        res.status(400).json({
            message: "Invalid organization id"
        })
        return
    }

    const organization = await organizationModel.findOne({
        _id: organizationId
    });

    const isAdmin = organization && organization.admin.toString() === userId;
    const isMember = organization && organization.members.some(m => m.toString() === userId);

    if (!organization || (!isAdmin && !isMember)) {
        res.status(403).json({
            message: "You are not part of this organization"
        })
        return
    }

    const boards = await boardModel.find({
        organizationId: organization._id
    })

    res.json({
        boards: boards.map(board => ({
            id: board._id,
            title: board.title,
            organizationId: board.organizationId
        }))
    })
})

app.get("/issues", authMiddleware, async (req, res) => {
    const userId = req.userId;
    const boardId = req.query.boardId;

    if (!mongoose.Types.ObjectId.isValid(boardId)) {
        res.status(400).json({
            message: "Invalid board id"
        })
        return
    }

    const board = await boardModel.findOne({
        _id: boardId
    });

    if (!board) {
        res.status(411).json({
            message: "Board not found"
        })
        return
    }

    const organization = await organizationModel.findOne({
        _id: board.organizationId
    });

    const isAdmin = organization && organization.admin.toString() === userId;
    const isMember = organization && organization.members.some(m => m.toString() === userId);

    if (!organization || (!isAdmin && !isMember)) {
        res.status(403).json({
            message: "You are not part of this organization"
        })
        return
    }

    const issues = await issueModel.find({
        boardId: board._id
    })

    res.json({
        issues: issues.map(issue => ({
            id: issue._id,
            title: issue.title,
            boardId: issue.boardId,
            state: issue.state
        }))
    })
})

app.get("/members", authMiddleware, async (req, res) => {
    const userId = req.userId;
    const organizationId = req.query.organizationId;

    if (!mongoose.Types.ObjectId.isValid(organizationId)) {
        res.status(400).json({
            message: "Invalid organization id"
        })
        return
    }

    const organization = await organizationModel.findOne({
        _id: organizationId
    });

    const isAdmin = organization && organization.admin.toString() === userId;
    const isMember = organization && organization.members.some(m => m.toString() === userId);

    if (!organization || (!isAdmin && !isMember)) {
        res.status(403).json({
            message: "You are not part of this organization"
        })
        return
    }

    const members = await userModel.find({
        _id: organization.members
    })

    res.json({
        members: members.map(member => ({
            id: member._id,
            username: member.username
        }))
    })
})

// UPDATE
app.put("/issues", authMiddleware, async (req, res) => {
    const userId = req.userId;
    const issueId = req.body.issueId;
    const title = req.body.title;
    const state = req.body.state;

    if (!mongoose.Types.ObjectId.isValid(issueId)) {
        res.status(400).json({
            message: "Invalid issue id"
        })
        return
    }

    const issue = await issueModel.findOne({
        _id: issueId
    });

    if (!issue) {
        res.status(411).json({
            message: "Issue not found"
        })
        return
    }

    const board = await boardModel.findOne({
        _id: issue.boardId
    });
    const organization = board ? await organizationModel.findOne({ _id: board.organizationId }) : null;

    const isAdmin = organization && organization.admin.toString() === userId;
    const isMember = organization && organization.members.some(m => m.toString() === userId);

    if (!organization || (!isAdmin && !isMember)) {
        res.status(403).json({
            message: "You are not part of this organization"
        })
        return
    }

    if (title !== undefined) {
        issue.title = title
    }

    if (state !== undefined) {
        issue.state = state
    }

    await issue.save();

    res.json({
        message: "Issue updated",
        issue: {
            id: issue._id,
            title: issue.title,
            boardId: issue.boardId,
            state: issue.state
        }
    })
})


app.delete("/members", authMiddleware, async (req, res) => {
    const userId = req.userId;
    const organizationId = req.body.organizationId;
    const memberUsername = req.body.memberUsername; 

    if (!mongoose.Types.ObjectId.isValid(organizationId)) {
        res.status(400).json({
            message: "Invalid organization id"
        })
        return
    }

    // const organization = ORGANIZATIONS.find(org => org.id === organizationId);
    const organization = await organizationModel.findOne({
        _id: organizationId
    });

    if (!organization || organization.admin.toString() !== userId) {
        res.status(411).json({
            message: "Either this org doesnt exist or you are not an admin of this org"
        })
        return
    }

    const memberUser = await userModel.findOne({
        username: memberUsername
    })

    if (!memberUser) {
        res.status(411).json({
            message: "No user with this username exists in our db"
        })
        return
    }

    const isMember = organization.members.some(
        memberId => memberId.toString() === memberUser._id.toString()
    );

    if (!isMember) {
        res.status(411).json({
            message: "User is not a member of this organization"
        })
        return
    }

    organization.members.pull(memberUser._id);
    await organization.save();

    res.json({
        message: "member deleted!"
    })
})

app.listen(3000);