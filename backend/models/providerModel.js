const mongoose = require("mongoose");

const idNumber = mongoose.Schema(
  {
    number: { type: String },
    type: { type: String },
  },
  { _id: false }
);

const providerSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "Provider has to have some name."],
  },
  description: {
    type: String,
  },
  identificationNumber: [idNumber],
});

module.exports = mongoose.model("Provider", providerSchema);
