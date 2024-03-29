const asyncHandler = require("express-async-handler");
const Lesson = require("../models/lessonModel");
const Timetable = require("../models/timetableModel");
const mongoose = require("mongoose");

/**
 * @desc Get Lessons
 * @route GET /api/Lessons
 * @access Private
 */
const getLessons = asyncHandler(async (req, res) => {
  let arg = {};

  if (req.query.id) {
    const ids = Array.isArray(req.query.id)
      ? req.query.id.map((id) => new mongoose.Types.ObjectId(id))
      : req.query.id.split(",").map((id) => new mongoose.Types.ObjectId(id));
    arg = { ...arg, $or: [{ course: { $in: ids } }, { _id: { $in: ids } }] };
  }

  let select = "-content";
  if (req.query.detail === "true") {
    select = "";
  }

  if (req.query.keyword) {
    const keyword = new RegExp(".*" + req.query.keyword + ".*", "i");
    arg = { ...arg, title: { $regex: keyword } };
  }

  const lessons = await Lesson.find(arg).select(select);

  res.status(200).json(lessons);
});

/**
 * @desc Create Lesson
 * @route POST /api/Lessons
 * @access Private
 */
const setLesson = asyncHandler(async (req, res) => {
  if (!req.body.title) {
    res.status(400);
    throw new Error("Please add lesson title");
  }

  const lesson = await Lesson.create(req.body);

  res.status(200).json(lesson);
});

/**
 * @desc Update Lessons
 * @route PUT /api/Lessons/:id
 * @access Private
 */
const updateLesson = asyncHandler(async (req, res) => {
  const lesson = await Lesson.findById(req.params.id);

  if (!lesson) {
    res.status(400);
    throw new Error("Lesson not find");
  }

  const updatedLesson = await Lesson.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
    },
  );

  res.status(200).json(updatedLesson);
});

/**
 * @desc Delete Lessons
 * @route DELETE /api/Lessons/:id
 * @access Private
 */
const deleteLesson = asyncHandler(async (req, res) => {
  const lesson = await Lesson.findById(req.params.id);

  if (!lesson) {
    res.status(400);
    throw new Error("Lesson not find");
  }

  await Timetable.updateMany(
    { lesson: lesson._id },
    { $pull: { lesson: lesson._id } },
    { multi: true },
  );

  await lesson.deleteOne();

  res.status(200).json({ id: req.params.id });
});

module.exports = {
  getLessons,
  setLesson,
  updateLesson,
  deleteLesson,
};
