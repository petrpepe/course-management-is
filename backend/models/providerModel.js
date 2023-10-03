const mongoose = require('mongoose');

const providerSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Provider has to have some name."],
        },
        description: {
            type: String,
        },
        identificationNumber: [{
            type: { type: String },
            number: { type: String },
        }],
    }
)

module.exports = mongoose.model("Provider", providerSchema)  