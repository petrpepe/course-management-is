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
        isActive: {
            type: Boolean,
        },
        lessons: [{
            lesson: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Lesson",
            },
            orderNumber: { type: Number },
        }]
    }, {
        timestamps: true,
    }
)

module.exports = mongoose.model("Course", courseSchema)  