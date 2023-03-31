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
        startDatetime: {
            type: Date
        },
        repeatDay: {
            day: { type: Number },
            time: { type: Date },
            count: { type: Number },
        },
        course: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course",
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