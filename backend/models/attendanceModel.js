const mongoose = require('mongoose');

const attendaceSchema = mongoose.Schema(
    {
        datetime: {
            type: Date,
            required: [true, "Attendance record need to happen (datetime)"],
        },
        class: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Class",
        },
        lesson: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Lesson",
        },
        attendees: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        }]
    }
)

module.exports = mongoose.model("Attendace", attendaceSchema)  