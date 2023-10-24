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
        timetableId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Lesson",
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        attended: {
            type: Boolean
        },
        note: {
            type: String
        }
    }
)

module.exports = mongoose.model("Attendance", attendaceSchema)  