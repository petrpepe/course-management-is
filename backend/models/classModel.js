const mongoose = require('mongoose');

const classSchema = mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Class should have some title"],
        },
        description: {
            type: String,
        },
        startDateTime: {
            type: Date
        },
        repeatCount: {
            type: Number,
        },
        course: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course",
        },
        currentLesson: {
            lessonNumber: { type: Number },
            lesson: { type: mongoose.Schema.Types.ObjectId },
        },
        teachers: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        }],
        students: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        }],
    }, {
        timestamps: true,
    }
)

module.exports = mongoose.model("Class", classSchema)  