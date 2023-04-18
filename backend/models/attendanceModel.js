const mongoose = require('mongoose');

const attendaceSchema = mongoose.Schema(
    {
        datetime: {
            type: Date,
            required: [true, "Attendance record need to happen (datetime)"],
        },
        classId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Class",
        },
        lessonId: {
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