const asyncHandler = require('express-async-handler')
const Course = require('../models/courseModel');

// @desc Get courses
// @route GET /api/courses
// @access Private
const getCourses = asyncHandler(async (req, res) => {
    const courses = await Course.find({ user: req.user.id })

    res.status(200).json(courses)
})

// @desc Create courses
// @route POST /api/courses
// @access Private
const setCourse = asyncHandler(async (req, res) => {
    if(!req.body.name){
        res.status(400)
        throw new Error("Please add text")
    }

    const course = await Course.create({
        name: req.body.name,
        user: req.user.id,
    })

    res.status(200).json(course)
})

// @desc Update courses
// @route PUT /api/courses/:id
// @access Private
const updateCourse = asyncHandler(async (req, res) => {
    const course = await Course.findById(req.params.id)

    if(!course) {
        res.status(400)
        throw new Error("Course not find")
    }

    if(!req.user) {
        res.status(401)
        throw new Error("User not found")
    }

    if(!course.users.includes(req.user.id)) {
        res.status(403)
        throw new Error("User not authorized")
    }

    const updatedCourse = await Course.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
    })

    res.status(200).json(updatedCourse)
})

// @desc Delete courses
// @route DELETE /api/courses/:id
// @access Private
const deleteCourse = asyncHandler(async (req, res) => {
    const course = await Course.findById(req.params.id)

    if(!course) {
        res.status(400)
        throw new Error("Course not find")
    }

    if(!req.user) {
        res.status(401)
        throw new Error("User not found")
    }

    if(course.user.toString() != req.user.id) {
        res.status(403)
        throw new Error("User not authorized")
    }

    await course.remove()

    res.status(200).json({id: req.params.id})
})

module.exports = {
    getCourses,
    setCourse,
    updateCourse,
    deleteCourse
}