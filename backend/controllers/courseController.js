const asyncHandler = require('express-async-handler')

const Course = require('../models/courseModel');

// @desc Get courses
// @route GET /api/coourses
// @access Private
const getCourse = asyncHandler(async (req, res) => {
    const courses = await Course.find()

    res.status(200).json(courses)
})

// @desc Create courses
// @route POST /api/coourses
// @access Private
const setCourse = asyncHandler(async (req, res) => {
    if(!req.body.text){
        res.status(400)
        throw new Error("Please add text")
    }

    const course = await Course.create({
        text: req.body.text,
    })

    res.status(200).json(course)
})

// @desc Update courses
// @route PUT /api/coourses/:id
// @access Private
const updateCourse = asyncHandler(async (req, res) => {
    const course = await Course.findById(req.params.id)

    if(!course) {
        res.status(400)
        throw new Error("Course not find")
    }

    const updatedCourse = await Course.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
    })

    res.status(200).json(updatedCourse)
})

// @desc Delete courses
// @route DELETE /api/coourses/:id
// @access Private
const deleteCourse = asyncHandler(async (req, res) => {
    const course = await Course.findById(req.params.id)

    if(!course) {
        res.status(400)
        throw new Error("Course not find")
    }

    await course.remove()

    res.status(200).json({id: req.params.id})
})

module.exports = {
    getCourse,
    setCourse,
    updateCourse,
    deleteCourse
}