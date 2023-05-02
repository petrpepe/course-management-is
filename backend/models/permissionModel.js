const mongoose = require('mongoose');

const permissionSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Permission needs to have some name"],
            unique: [true, "Permission needs to have unique name"],
        },
        description: {
            type: String,
        },
    }
)

module.exports = mongoose.model("Permission", permissionSchema)  