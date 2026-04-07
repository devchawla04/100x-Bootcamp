const dotenv = require("dotenv")
const mongoose = require("mongoose");

dotenv.config();

mongoose.connect(process.env.MONGODB_URI);

/// schemas and models

const userSchema = mongoose.Schema({
    username: String,
    password: String
})

const organizationSchema = mongoose.Schema({
    title: String,
    description: String,
    admin: mongoose.Types.ObjectId,
    members: [mongoose.Types.ObjectId]
})

const boardSchema = mongoose.Schema({
    title: String,
    organizationId: mongoose.Types.ObjectId,
    createdBy: mongoose.Types.ObjectId
})

const issueSchema = mongoose.Schema({
    title: String,
    boardId: mongoose.Types.ObjectId,
    state: {
        type: String,
        enum: ["TODO", "IN_PROGRESS", "DONE"],
        default: "TODO"
    },
    createdBy: mongoose.Types.ObjectId
})


const organizationModel = mongoose.model("organizations", organizationSchema);
const boardModel = mongoose.model("boards", boardSchema);
const issueModel = mongoose.model("issues", issueSchema);
const userModel = mongoose.model("users", userSchema);

module.exports = {
    organizationModel,
    boardModel,
    issueModel,
    userModel
}