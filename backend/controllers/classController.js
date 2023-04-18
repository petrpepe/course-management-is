const asyncHandler = require('express-async-handler')
const Class = require('../models/classModel');
const mongoose = require("mongoose")

/**
 * @desc Get Classes
 * @route GET /api/Classes
 * @access Private
 */
const getClasses = asyncHandler(async (req, res) => {
    let arg = {}
    if (req.userRoles.includes("admin")) {
        arg = {}
    } else arg = {$or: [{students: req.user._id}, {teachers: req.user._id}]}

    if(req.query.id && req.query.id != null) {
        const ids = typeof req.query.id == "string" ? mongoose.Types.ObjectId(req.query.id) 
        : req.query.id.map((id) => mongoose.Types.ObjectId(id))
        arg = {_id: {$in: ids}}
    }
 
    const classVar = await Class.find(arg)

    res.status(200).json(classVar)
})

/**
 * @desc Create Class
 * @route POST /api/classes
 * @access Private
 * courseId => get lessons (slo by taky z frontendu alespon lessonIds s orderNum a to staci?!! asi jo),
 * z frontendu: classId, datetime prvni attendance, attendees z class
 * vytvorit az tady nebo uz rovnou na frontendu? Prvni mozna frontend zbytek tu
 * req.body = {
 *   datetime: classDatetime + (7 * for pocet lekci), 
 *   class: classId, 
 *   lessonId: lessonId z course lessons s orderNumber, 
 *   attendees: [nejdriv prazdne a pak po zapisu ucitelem],
 * }
 */
const setClass = asyncHandler(async (req, res) => {
    if(!req.body.title){
        res.status(400)
        throw new Error("Please add datetime")
    }
    console.log(req.body);
    if (req.body.currentLesson && req.body.currentLesson.lesson === "") {
        req.body.currentLesson.lesson = null
    }

    const classVar = await Class.create(req.body)

    res.status(200).json(classVar)
})

/**
 * @desc Update Class
 * @route PUT /api/classes/:id
 * @access Private
 */
const updateClass = asyncHandler(async (req, res) => {
    const classVar = await Class.findById(req.params.id)

    if(!classVar) {
        res.status(400)
        throw new Error("Class not find")
    }

    if (req.body.currentLesson && req.body.currentLesson.lesson === "") {
        req.body.currentLesson.lesson = null
    }

    const updatedClass = await Class.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
    })

    res.status(200).json(updatedClass)
})

/**
 * @desc Delete Class
 * @route DELETE /api/classes/:id
 * @access Private
 */
const deleteClass = asyncHandler(async (req, res) => {
    const classVar = await Class.findById(req.params.id)

    if(!classVar) {
        res.status(400)
        throw new Error("Class not find")
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