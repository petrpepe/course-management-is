const mongoose = require('mongoose');

const userSchema = mongoose.Schema(
    {
        firstName: {
            type: String,
            required: [true, "User needs to have first name"],
        },
        otherNames: [{
            type: String,
        }],
        lastName: {
            type: String,
            required: [true, "User needs to have last name"],
        },
        email: {
            type: String,
            required: [true, "User needs to have unique email"],
            unique: true,
        },
        password: {
            type: String,
            required: [true, "User needs to have some password"],
        },
        phone: [{
            number: { type: String },
            type: { type: String },
        }],
        courses: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course",
        }],
        roles: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Role",
            required: [true, "User needs at least guest role"],
        }],
        extraPerms: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Permission",
        }],
    }, {
        timestamps: true
    }
)

module.exports = mongoose.model("User", userSchema)