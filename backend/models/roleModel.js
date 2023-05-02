const mongoose = require('mongoose');

const roleSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Role has to have some name."],
            unique: [true, "Role name has to be unique."],
        },
        description: {
            type: String,
        },
        permissions: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Permission",
        }]
    }
)

module.exports = mongoose.model("Role", roleSchema)  