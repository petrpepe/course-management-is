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
        approval: [{
            aprrovalRequired: {type: Boolean},
            aprrovedBy: [{
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            }],
        }]
    }, {
        timestamps: true,
    }
)

module.exports = mongoose.model("Lesson", lessonSchema)  