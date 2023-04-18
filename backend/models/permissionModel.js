const mongoose = require('mongoose');

const permissionSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Permission should have some name"],
            unique: true,
        },
        description: {
            type: String,
        },
    }
)

module.exports = mongoose.model("Permission", permissionSchema)  