const asyncHandler = require("express-async-handler");
const Enrollment = require("../models/enrollmentModel");
const User = require("../models/userModel");
const mongoose = require("mongoose");
const { sendEmail } = require("./emailController");
const Class = require("../models/classModel");

/**
 * @desc Get Enrollments
 * @route GET /api/Enrollments
 * @access Private
 */
const getEnrollments = asyncHandler(async (req, res) => {
  let arg = {};

  if (req.query.id) {
    const ids = Array.isArray(req.query.id)
      ? req.query.id.map((id) => new mongoose.Types.ObjectId(id))
      : req.query.id.split(",").map((id) => new mongoose.Types.ObjectId(id));
    arg = {
      $or: [
        { classId: { $in: ids } },
        { students: { $in: ids } },
        { _id: { $in: ids } },
      ],
    };
  }

  const Enrollments = await Enrollment.find(arg);

  res.status(200).json(Enrollments);
});

/**
 * @desc Create enrollment
 * @route POST /api/enrollment
 * @access Private
 */
const setEnrollment = asyncHandler(async (req, res) => {
  const { classId, students } = req.body;
  if (!classId) {
    res.status(400);
    throw new Error("Please specify classId");
  }

  const enrollments = await Enrollment.create(req.body);

  const users = await User.find({ _id: { $in: students } });
  const classVar = await Class.find({
    _id: new mongoose.Types.ObjectId(req.body.classId),
  }).select("title");

  for (const user of users) {
    try {
      await sendEmail(
        "no-reply@noreplycris.com",
        user.email,
        "",
        "New account",
        "<div>" +
          "<p>Dear " +
          user.firstName +
          " " +
          user.lastName +
          ",</p>" +
          "<p>you have been assigned to class " +
          classVar.title +
          "</p>" +
          "</ br>" +
          "<p>You can <a href='" +
          process.env.FRONTEND_URL +
          "/login'>login</a> and see it in the list.</p>" +
          "<p>crsis</p>"
      );
    } catch (error) {
      res.status(500);
      throw new Error(error);
    }
  }

  res.status(200).json(enrollments);
});

/**
 * @desc Update enrollment by id
 * @route PUT /api/enrollments/:id
 * @access Private
 */
const updateEnrollment = asyncHandler(async (req, res) => {
  const enrollment = await Enrollment.findById(req.params.id);

  if (!enrollment) {
    res.status(400);
    throw new Error("Enrollment not find");
  }

  const updatedEnrollment = await Enrollment.findByIdAndUpdate(
    enrollment._id,
    { $set: { students: req.body.students } },
    {
      new: true,
    }
  );

  res.status(200).json(updatedEnrollment);

  for (const student of updatedEnrollment.students) {
    if (!enrollment.students.includes(student)) {
      const user = await User.findById(student).select(
        "email firstName lastName"
      );
      const classVar = await Class.findById(updatedEnrollment.classId).select(
        "title"
      );

      await sendEmail(
        "no-reply@noreplycris.com",
        "svobodapetr803@gmail.com",
        "",
        "New class",
        "<div>" +
          "<p>Dear " +
          user.firstName +
          " " +
          user.lastName +
          ",</p>" +
          "<p>you have been assigned to class " +
          classVar.title +
          "</p>" +
          "</ br>" +
          "<p>You can <a href='" +
          process.env.FRONTEND_URL +
          "/login'>login</a> and see it in the list.</p>" +
          "<p>crsis</p>"
      );
    }
  }
});

/**
 * @desc Delete enrollment by id
 * @route DELETE /api/enrollments/:id
 * @access Private
 */
const deleteEnrollment = asyncHandler(async (req, res) => {
  const enrollment = await Enrollment.findById(req.params.id);

  if (!enrollment) {
    res.status(400);
    throw new Error("Enrollment not find");
  }

  await enrollment.deleteOne();

  res.status(200).json({ id: req.params.id });
});

module.exports = {
  getEnrollments,
  setEnrollment,
  updateEnrollment,
  deleteEnrollment,
};
