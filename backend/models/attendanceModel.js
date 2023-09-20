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
        attendee: {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
            attType: {type: String}
        }
    }
)

module.exports = mongoose.model("Attendance", attendaceSchema)  