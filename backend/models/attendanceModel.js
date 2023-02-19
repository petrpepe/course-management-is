const mongoose = require('mongoose');

const attendaceSchema = mongoose.Schema(
    {
        orderNum: {
            type: Number,
        },
        datetime: {
            type: Date,
        },
        lesson: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Lesson",
        },
        users: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        }]
    }
)

module.exports = mongoose.model("Attendace", attendaceSchema)  