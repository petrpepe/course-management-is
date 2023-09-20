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
        place: {
            type: String
        },
        startDateTime: {
            type: Date,
        },
        course: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course",
        },
        lectors: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        }],
    }, {
        timestamps: true,
    }
)

module.exports = mongoose.model("Class", classSchema)  