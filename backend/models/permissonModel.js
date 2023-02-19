const mongoose = require('mongoose');

const permissonSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Permisson should have some name"],
            unique: true,
        },
        description: {
            type: String,
        },
    }
)

module.exports = mongoose.model("Permisson", permissonSchema)  