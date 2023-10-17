const mongoose = require('mongoose');

const lessonSchema = mongoose.Schema(
    {
        lessonNum: {
            type: Number
        },
        title: {
            type: String,
            required: [true, "Lesson should have some title"],
        },
        description: {
            type: String,
        },
        materials: {
            type: String
        },
        duration: {
            type: Number
        },
        course: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course",
        },
        aprrovedBy: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        }],
        content: {
            type: String
        },
    }, {
        timestamps: true,
    }
)

module.exports = mongoose.model("Lesson", lessonSchema)  