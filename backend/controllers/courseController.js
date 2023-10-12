const asyncHandler = require('express-async-handler')
const Course = require('../models/courseModel')
const Class = require('../models/classModel')
const mongoose = require("mongoose")

/**
 * @desc Get courses
 * @route GET /api/courses
 * @access Private
 */
const getCourses = asyncHandler(async (req, res) => {
    let arg = {}

    if(req.query.id && req.query.id != null) {
        const ids = typeof req.query.id == "string" ? mongoose.Types.ObjectId(req.query.id) 
        : req.query.id.map((id) => mongoose.Types.ObjectId(id))
        arg = {_id: {$in: ids}}
    }

    if(req.query.keyword && req.query.keyword != null) {
        const keyword = new RegExp(".*" + req.query.keyword + ".*", "i")
        arg = {...arg, title: {$regex: keyword}}
    }

    const courses = await Course.find(arg)

    res.status(200).json(courses)
})

/**
 * @desc Get course by id
 * @route GET /api/courses/:id
 * @access Private
 */
const getCourseById = asyncHandler(async (req, res) => {
    const course = await Course.findById(req.params.id)

    if(!course) {
        res.status(400)
        throw new Error("Course not find")
    }

    res.status(200).json(course)
})

/**
 * @desc Create courses
 * @route POST /api/courses
 * @access Private
 */
const setCourse = asyncHandler(async (req, res) => {
    if(!req.body.title){
        res.status(400)
        throw new Error("Please add course title ", req.body)
    }

    req.body.owner = req.body.owner ? req.body.owner : null
    const course = await Course.create(req.body)

    res.status(200).json(course)
})

/**
 * @desc Update courses
 * @route PUT /api/courses/:id
 * @access Private
 */
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

/**
 * @desc Delete courses
 * @route DELETE /api/courses/:id
 * @access Private
 */
const deleteCourse = asyncHandler(async (req, res) => {
    const course = await Course.findById(req.params.id)

    if(!course) {
        res.status(400)
        throw new Error("Course not find")
    }

    await Class.updateMany({course: course._id}, {$pull: {course: course._id}}, {multi: true})

    await course.remove()

    res.status(200).json({id: req.params.id})
})

module.exports = {
    getCourses,
    getCourseById,
    setCourse,
    updateCourse,
    deleteCourse
}