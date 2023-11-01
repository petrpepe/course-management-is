const mongoose = require("mongoose");

const timetableSchema = mongoose.Schema({
  datetime: {
    type: Date,
  },
  classId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Class",
  },
  lesson: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Lesson",
  },
  lector: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  extraUser: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

module.exports = mongoose.model("Timetable", timetableSchema);
