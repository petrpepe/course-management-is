const asyncHandler = require('express-async-handler')
const Lesson = require('../models/lessonModel');

// @desc Get Lessons
// @route GET /api/Lessons
// @access Private
const getLessons = asyncHandler(async (req, res) => {
    const lessons = await Lesson.find({ user: req.user.id })

    res.status(200).json(lessons)
})

// @desc Create Lesson
// @route POST /api/Lessons
// @access Private
const setLesson = asyncHandler(async (req, res) => {
    if(!req.body.title){
        res.status(400)
        throw new Error("Please add lesson title")
    }

    const lesson = await Lesson.create(req.body)

    res.status(200).json(lesson)
})

// @desc Update Lessons
// @route PUT /api/Lessons/:id
// @access Private
const updateLesson = asyncHandler(async (req, res) => {
    const lesson = await Lesson.findById(req.params.id)

    if(!lesson) {
        res.status(400)
        throw new Error("Lesson not find")
    }

    if(!req.user) {
        res.status(401)
        throw new Error("User not found")
    }

    console.log(currentLesson);
    if (req.body.currentLesson.lesson === "") {
        req.body.currentLesson.lesson = null
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
    const lesson = await Lesson.findById(req.params.id)

    if(!lesson) {
        res.status(400)
        throw new Error("Lesson not find")
    }

    if(!req.user) {
        res.status(401)
        throw new Error("User not found")
    }

    await lesson.remove()

    res.status(200).json({id: req.params.id})
})

module.exports = {
    getLessons,
    setLesson,
    updateLesson,
    deleteLesson
}