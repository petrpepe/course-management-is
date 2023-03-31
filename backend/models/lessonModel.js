const mongoose = require('mongoose');

const lessonSchema = mongoose.Schema(
    {
        supposedOrderNum: {
            type: Number
        },
        title: {
            type: String,
            required: [true, "Lesson should have some title"],
        },
        description: {
            type: String,
        },
        duration: {
            type: Number
        },
        materials: {
            type: String
        }
    }, {
        timestamps: true,
    }
)

module.exports = mongoose.model("Lesson", lessonSchema)  