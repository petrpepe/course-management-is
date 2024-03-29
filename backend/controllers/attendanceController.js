const asyncHandler = require("express-async-handler");
const Attendance = require("../models/attendanceModel");

/**
 * @desc Get Attendances
 * @route GET /api/Attendances
 * @access Private
 */
const getAttendances = asyncHandler(async (req, res) => {
  const attendances = await Attendance.find(req.arg);

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
