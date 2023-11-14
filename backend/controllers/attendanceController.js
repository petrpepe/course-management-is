const asyncHandler = require("express-async-handler");
const Attendance = require("../models/attendanceModel");
const Timetable = require("../models/timetableModel");
const mongoose = require("mongoose");

/**
 * @desc Get Attendances
 * @route GET /api/Attendances
 * @access Private
 */
const getAttendances = asyncHandler(async (req, res) => {
  const { id, startDatetime, endDatetime } = req.query;
  let arg = {};
  if (id && id.length > 0) {
    const ids = Array.isArray(id)
      ? id.map((id) => new mongoose.Types.ObjectId(id))
      : id.split(",").map((id) => new mongoose.Types.ObjectId(id));
    const timetables = await Timetable.find({ classId: { $in: ids } });
    arg = {
      $or: [
        { timetableId: { $in: timetables.map((t) => t._id).concat(ids) } },
        { userId: { $in: ids } },
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

  const attendances = await Attendance.find(arg);

  res.status(200).json(attendances);
});

/**
 * ziskat uzivatele z classId pokud neni tak supl
 *
 * @desc Create Attendances
 * @route POST /api/Attendances
 * @access Private
 */
const setAttendance = asyncHandler(async (req, res) => {
  if (!req.body.datetime) {
    res.status(400);
    throw new Error("Please add datetime");
  }

  const attendance = await Attendance.create(req.body);

  res.status(200).json(attendance);
});

/**
 * @desc Update Attendances
 * @route PUT /api/Attendances/:id
 * @access Private
 */
const updateAttendance = asyncHandler(async (req, res) => {
  const attendance = await Attendance.findById(req.params.id);

  if (!attendance) {
    res.status(400);
    throw new Error("Attendance not find");
  }

  const updatedAttendance = await Attendance.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  res.status(200).json(updatedAttendance);
});

/**
 * @desc Delete Attendances
 * @route DELETE /api/Attendances/:id
 * @access Private
 */
const deleteAttendance = asyncHandler(async (req, res) => {
  const attendance = await Attendance.findById(req.params.id);

  if (!attendance) {
    res.status(400);
    throw new Error("Attendance not find");
  }

  await attendance.deleteOne();

  res.status(200).json({ id: req.params.id });
});

module.exports = {
  getAttendances,
  setAttendance,
  updateAttendance,
  deleteAttendance,
};
