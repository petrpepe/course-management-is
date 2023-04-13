const asyncHandler = require('express-async-handler')
const Class = require('../models/classModel');

// @desc Get Classes
// @route GET /api/Classes
// @access Private
const getClasses = asyncHandler(async (req, res) => {
    const classVar = await Class.find({ user: req.user.id })

    res.status(200).json(classVar)
})

// @desc Create Class
// @route POST /api/classes
// @access Private
const setClass = asyncHandler(async (req, res) => {
    if(!req.body.title){
        res.status(400)
        throw new Error("Please add datetime")
    }
    
    console.log(req.body.currentLesson.lesson);
    if (req.body.currentLesson && req.body.currentLesson.lesson === "") {
        req.body.currentLesson.lesson = null
    }

    const classVar = await Class.create(req.body)

    res.status(200).json(classVar)
})

// @desc Update Class
// @route PUT /api/classes/:id
// @access Private
const updateClass = asyncHandler(async (req, res) => {
    const classVar = await Class.findById(req.params.id)

    if(!classVar) {
        res.status(400)
        throw new Error("Class not find")
    }

    if(!req.user) {
        res.status(401)
        throw new Error("User not found")
    }

    const updatedClass = await Class.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
    })

    res.status(200).json(updatedClass)
})

// @desc Delete Class
// @route DELETE /api/classes/:id
// @access Private
const deleteClass = asyncHandler(async (req, res) => {
    const classVar = await Class.findById(req.params.id)

    if(!classVar) {
        res.status(400)
        throw new Error("Class not find")
    }

    if(!req.user) {
        res.status(401)
        throw new Error("User not found")
    }

    await classVar.remove()

    res.status(200).json({id: req.params.id})
})

module.exports = {
    getClasses,
    setClass,
    updateClass,
    deleteClass
}