const asyncHandler = require('express-async-handler')
const Lesson = require('../models/lessonModel');

// @desc Get Lessons
// @route GET /api/Lessons
// @access Private
const getLessons = asyncHandler(async (req, res) => {
    const Lessons = await Lesson.find({ user: req.user.id })

    res.status(200).json(Lessons)
})

// @desc Create Lessons
// @route POST /api/Lessons
// @access Private
const setLesson = asyncHandler(async (req, res) => {
    if(!req.body.title){
        res.status(400)
        throw new Error("Please add lesson title")
    }

    const Lesson = await Lesson.create(req.body)

    res.status(200).json(Lesson)
})

// @desc Update Lessons
// @route PUT /api/Lessons/:id
// @access Private
const updateLesson = asyncHandler(async (req, res) => {
    const Lesson = await Lesson.findById(req.params.id)

    if(!Lesson) {
        res.status(400)
        throw new Error("Lesson not find")
    }

    if(!req.user) {
        res.status(401)
        throw new Error("User not found")
    }

    const updatedLesson = await Lesson.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
    })

    res.status(200).json(updatedLesson)
})

// @desc Delete Lessons
// @route DELETE /api/Lessons/:id
// @access Private
const deleteLesson = asyncHandler(async (req, res) => {
    const Lesson = await Lesson.findById(req.params.id)

    if(!Lesson) {
        res.status(400)
        throw new Error("Lesson not find")
    }

    if(!req.user) {
        res.status(401)
        throw new Error("User not found")
    }

    await Lesson.remove()

    res.status(200).json({id: req.params.id})
})

module.exports = {
    getLessons,
    setLesson,
    updateLesson,
    deleteLesson
}