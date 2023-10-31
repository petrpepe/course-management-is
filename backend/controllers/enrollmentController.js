const asyncHandler = require('express-async-handler')
const Enrollment = require('../models/enrollmentModel')
const User = require('../models/userModel')
const mongoose = require("mongoose")

/**
 * @desc Get Enrollments
 * @route GET /api/Enrollments
 * @access Private
 */
const getEnrollments = asyncHandler(async (req, res) => {
    let arg = {}

    if(req.query.id) {
        const ids = typeof req.query.id == "string" ? new mongoose.Types.ObjectId(req.query.id)
        : req.query.id.map((id) => new mongoose.Types.ObjectId(id))
        arg = {$or: [{classId: {$in: ids}}, {student: {$in: ids}}, {_id: {$in: ids}}]}
    }
console.log(arg);
    const Enrollments = await Enrollment.find(arg)
console.log(Enrollments);
    res.status(200).json(Enrollments)
})

/**
 * @desc Create enrollment
 * @route POST /api/enrollment
 * @access Private
 */
const setEnrollment = asyncHandler(async (req, res) => {
    const {classId, students} = req.body
    if(!classId){
        res.status(400)
        throw new Error("Please specify classId")
    }

    let enrollments = []
    for (let i = 0; i < students.length; i++) {
        const enrollment = await Enrollment.create({classId: classId, student: students[i]})
        enrollments.push(enrollment)
    }

    const users = await User.find({_id: {$in: students}})
    
    for (const user of users) {
        try {
            await sendEmail("no-reply@noreplycris.com", user.email, "", "New account",
            "<div>" +
            "<p>Dear " + user.firstName + " " + user.lastName + ",</p>" +
            "<p>you have been assigned to class " + classVar.title + "</p>" +
            "</ br>" +
            "<p>You can <a href='" + process.env.FRONTEND_URL + "/login'>login</a> and see it in the list.</p>" +
            "<p>crsis</p>", res, false
            )
        } catch(error) {
            res.status(500);
            throw new Error(error)
        }
    }

    res.status(200).json(enrollments)
})

/**
 * @desc Update enrollment by id
 * @route PUT /api/enrollments/:id
 * @access Private
 */
const updateEnrollment = asyncHandler(async (req, res) => {
    const enrollment = await Enrollment.findById(req.params.id)

    if(!enrollment) {
        res.status(400)
        throw new Error("Enrollment not find")
    }

    const updatedEnrollment = await Enrollment.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
    })

    res.status(200).json(updatedEnrollment)
})

/**
 * @desc Delete enrollment by id
 * @route DELETE /api/enrollments/:id
 * @access Private
 */
const deleteEnrollment = asyncHandler(async (req, res) => {
    const enrollment = await Enrollment.findById(req.params.id)

    if(!enrollment) {
        res.status(400)
        throw new Error("Enrollment not find")
    }

    await enrollment.remove()

    res.status(200).json({id: req.params.id})
})

module.exports = {
    getEnrollments,
    setEnrollment,
    updateEnrollment,
    deleteEnrollment
}