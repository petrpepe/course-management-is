const mongoose = require('mongoose');

const timetableSchema = mongoose.Schema(
    {
        dateTime: {
            type: Date,
        },
        class: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Class",
        },
        lesson: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Lesson",
        },
        lector: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        }]
    }
)

module.exports = mongoose.model("Timetable", timetableSchema)  