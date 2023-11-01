const mongoose = require("mongoose");

const subPhone = mongoose.Schema(
  {
    number: { type: String },
    type: { type: String },
  },
  { _id: false },
);

const userSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "User needs to have first name"],
    },
    otherNames: [
      {
        type: String,
      },
    ],
    lastName: {
      type: String,
      required: [true, "User needs to have last name"],
    },
    email: {
      type: String,
      required: [true, "User needs to have unique email"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "User needs to have some password"],
    },
    phone: [subPhone],
    roles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Role",
      },
    ],
    extraPerms: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Permission",
      },
    ],
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("User", userSchema);
