const mongoose = require('mongoose');

const roleSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Role should have some name"],
            unique: true,
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