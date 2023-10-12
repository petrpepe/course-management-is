const asyncHandler = require('express-async-handler')
const Enrollment = require('../models/enrollmentModel')
const User = require('../models/userModel')

/**
 * @desc Get Enrollments
 * @route GET /api/Enrollments
 * @access Private
 */
const getEnrollments = asyncHandler(async (req, res) => {
    const Enrollments = await Enrollment.find()

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