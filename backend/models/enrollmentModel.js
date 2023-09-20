const mongoose = require('mongoose');

const enrollmentSchema = mongoose.Schema(
    {
        class: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        student: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        }]
    }
)

module.exports = mongoose.model("Enrollment", enrollmentSchema)  