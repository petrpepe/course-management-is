const mongoose = require('mongoose');

const courseSchema = mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Course should have some title"],
        },
        description: {
            type: String,
        },
        users: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        }],
        lessons: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Lesson",
        }]
    }, {
        timestamps: true,
    }
)

module.exports = mongoose.model("Course", courseSchema)  