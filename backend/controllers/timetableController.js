const asyncHandler = require('express-async-handler')
const Timetable = require('../models/timetableModel')
const User = require('../models/userModel')

/**
 * @desc Get Timetables
 * @route GET /api/Timetables
 * @access Private
 */
const getTimetables = asyncHandler(async (req, res) => {
    const Timetables = await Timetable.find()

    res.status(200).json(Timetables)
})

/**
 * @desc Create timetable
 * @route POST /api/timetable
 * @access Private
 */
const setTimetable = asyncHandler(async (req, res) => {
    if(!req.body.name){
        res.status(400)
        throw new Error("Please add text")
    }

    const timetable = await Timetable.create(req.body)

    res.status(200).json(timetable)
})

/**
 * @desc Update timetable by id
 * @route PUT /api/timetables/:id
 * @access Private
 */
const updateTimetable = asyncHandler(async (req, res) => {
    const timetable = await Timetable.findById(req.params.id)

    if(!timetable) {
        res.status(400)
        throw new Error("Timetable not find")
    }

    const updatedTimetable = await Timetable.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
    })

    res.status(200).json(updatedTimetable)
})

/**
 * @desc Delete timetable by id
 * @route DELETE /api/timetables/:id
 * @access Private
 */
const deleteTimetable = asyncHandler(async (req, res) => {
    const timetable = await Timetable.findById(req.params.id)

    if(!timetable) {
        res.status(400)
        throw new Error("Timetable not find")
    }

    await timetable.remove()

    res.status(200).json({id: req.params.id})
})

module.exports = {
    getTimetables,
    setTimetable,
    updateTimetable,
    deleteTimetable
}