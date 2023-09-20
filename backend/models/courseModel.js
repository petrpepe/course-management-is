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
        academicTerm: {
            type: String,
        },        
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    }, {
        timestamps: true,
    }
)

module.exports = mongoose.model("Course", courseSchema)  