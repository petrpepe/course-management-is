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
        lessons: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Lesson",
        }]
    }, {
        timestamps: true,
    }
)

module.exports = mongoose.model("Course", courseSchema)  