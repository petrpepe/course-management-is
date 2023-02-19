const asyncHandler = require('express-async-handler')
const Attendance = require('../models/AttendanceModel');

// @desc Get Attendances
// @route GET /api/Attendances
// @access Private
const getAttendances = asyncHandler(async (req, res) => {
    const Attendances = await Attendance.find({ user: req.user.id })

    res.status(200).json(Attendances)
})

// @desc Create Attendances
// @route POST /api/Attendances
// @access Private
const setAttendance = asyncHandler(async (req, res) => {
    if(!req.body.name){
        res.status(400)
        throw new Error("Please add text")
    }

    const Attendance = await Attendance.create({
        name: req.body.name,
        user: req.user.id,
    })

    res.status(200).json(Attendance)
})

// @desc Update Attendances
// @route PUT /api/Attendances/:id
// @access Private
const updateAttendance = asyncHandler(async (req, res) => {
    const Attendance = await Attendance.findById(req.params.id)

    if(!Attendance) {
        res.status(400)
        throw new Error("Attendance not find")
    }

    if(!req.user) {
        res.status(401)
        throw new Error("User not found")
    }

    if(Attendance.user.toString() != req.user.id) {
        res.status(403)
        throw new Error("User not authorized")
    }

    const updatedAttendance = await Attendance.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
    })

    res.status(200).json(updatedAttendance)
})

// @desc Delete Attendances
// @route DELETE /api/Attendances/:id
// @access Private
const deleteAttendance = asyncHandler(async (req, res) => {
    const Attendance = await Attendance.findById(req.params.id)

    if(!Attendance) {
        res.status(400)
        throw new Error("Attendance not find")
    }

    if(!req.user) {
        res.status(401)
        throw new Error("User not found")
    }

    if(Attendance.user.toString() != req.user.id) {
        res.status(403)
        throw new Error("User not authorized")
    }

    await Attendance.remove()

    res.status(200).json({id: req.params.id})
})

module.exports = {
    getAttendances,
    setAttendance,
    updateAttendance,
    deleteAttendance
}