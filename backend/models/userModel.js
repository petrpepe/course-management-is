const mongoose = require('mongoose');

const userSchema = mongoose.Schema(
    {
        firstName: {
            type: String,
            required: [true, "User needs to have first name"],
        },
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
        }
    },
    {
        timestamps: true
    }
)

module.exports = mongoose.model("User", userSchema)