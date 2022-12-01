const mongoose = require('mongoose');

const courseSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User",
        },
        name: {
            type: String,
            required: [true, "Please add course name"],
        }
    }, {
        timestamps: true,
    }
)

module.exports = mongoose.model("Course", courseSchema)