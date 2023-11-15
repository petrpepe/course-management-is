const asyncHandler = require("express-async-handler");
const Course = require("../models/courseModel");
const Class = require("../models/classModel");
const Lesson = require("../models/lessonModel");
const mongoose = require("mongoose");

/**
 * @desc Get courses
 * @route GET /api/courses
 * @access Private
 */
const getCourses = asyncHandler(async (req, res) => {
  let arg = {};

  if (req.query.id) {
    const ids = Array.isArray(req.query.id)
      ? req.query.id.map((id) => new mongoose.Types.ObjectId(id))
      : req.query.id.split(",").map((id) => new mongoose.Types.ObjectId(id));
    arg = { ...arg, _id: { $in: ids } };
  }

  if (req.query.keyword) {
    const keyword = new RegExp(".*" + req.query.keyword + ".*", "i");
    arg = { ...arg, title: { $regex: keyword } };
  }

  const courses = await Course.find(arg);

  res.status(200).json(courses);
});

/**
 * @desc Create courses
 * @route POST /api/courses
 * @access Private
 */
const setCourse = asyncHandler(async (req, res) => {
  if (!req.body.title) {
    res.status(400);
    throw new Error("Please add course title ", req.body);
  }

  const course = await Course.create(req.body);

  res.status(200).json(course);
});

/**
 * @desc Update courses
 * @route PUT /api/courses/:id
 * @access Private
 */
const updateCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);

  if (!course) {
    res.status(400);
    throw new Error("Course not find");
  }

  const updatedCourse = await Course.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
    }
  );

  res.status(200).json(updatedCourse);
});

/**
 * @desc Delete courses
 * @route DELETE /api/courses/:id
 * @access Private
 */
const deleteCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);
  let smt = false;
  if (!course) {
    res.status(400);
    throw new Error("Course not find");
  }

  await Class.updateMany(
    { course: course._id },
    { $pull: { course: course._id } },
    { multi: true }
  );
  if (smt === true) {
    await Lesson.deleteMany({ course: course._id });
  }

  await course.deleteOne();

  res.status(200).json({ id: req.params.id });
});

module.exports = {
  getCourses,
  setCourse,
  updateCourse,
  deleteCourse,
};
