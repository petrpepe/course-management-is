const asyncHandler = require("express-async-handler");
const Timetable = require("../models/timetableModel");
const mongoose = require("mongoose");
const Attendance = require("../models/attendanceModel");

/**
 * @desc Get Timetables
 * @route GET /api/Timetables
 * @access Private
 */
const getTimetables = asyncHandler(async (req, res) => {
  const { id, startDatetime, endDatetime } = req.query;
  let arg = {};

  if (id) {
    const ids = Array.isArray(id)
      ? id.map((id) => new mongoose.Types.ObjectId(id))
      : id.split(",").map((id) => new mongoose.Types.ObjectId(id));
    arg = {
      $or: [
        { classId: { $in: ids } },
        { lectors: { $in: ids } },
        { lesson: { $in: ids } },
        { _id: { $in: ids } },
      ],
    };
  }

  if (startDatetime && endDatetime) {
    const start = new Date(startDatetime);
    const end = new Date(endDatetime);
    arg = {
      ...arg,
      datetime: { $gte: start.toISOString(), $lte: end.toISOString() },
    };
  }

  const Timetables = await Timetable.find(arg);

  res.status(200).json(Timetables);
});

/**
 * @desc Create timetable
 * @route POST /api/timetable
 * @access Private
 */
const setTimetable = asyncHandler(async (req, res) => {
  if (!req.body.datetime) {
    res.status(400);
    throw new Error("Please add datetime");
  }

  const timetable = await Timetable.create(req.body);

  res.status(200).json(timetable);
});

/**
 * @desc Update timetable by id
 * @route PUT /api/timetables/:id
 * @access Private
 */
const updateTimetable = asyncHandler(async (req, res) => {
  const timetable = await Timetable.findById(req.params.id);

  if (!timetable) {
    res.status(400);
    throw new Error("Timetable not find");
  }

  const updatedTimetable = await Timetable.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
    }
  );

  res.status(200).json(updatedTimetable);
});

/**
 * @desc Delete timetable by id
 * @route DELETE /api/timetables/:id
 * @access Private
 */
const deleteTimetable = asyncHandler(async (req, res) => {
  const timetable = await Timetable.findById(req.params.id);

  if (!timetable) {
    res.status(400);
    throw new Error("Timetable not find");
  }

  await Attendance.updateMany(
    { timetableId: timetable._id },
    { $pull: { timetableId: timetable._id } },
    { multi: true }
  );

  await timetable.deleteOne();

  res.status(200).json({ id: req.params.id });
});

module.exports = {
  getTimetables,
  setTimetable,
  updateTimetable,
  deleteTimetable,
};
