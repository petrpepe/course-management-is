const asyncHandler = require('express-async-handler')
const Attendance = require('../models/attendanceModel')
const Class = require('../models/classModel')
const Lesson = require('../models/lessonModel')
const User = require('../models/userModel')

/** 
 * @desc Get Attendances
 * @route GET /api/Attendances
 * @access Private
 */
const getAttendances = asyncHandler(async (req, res) => {
    let arg = {}

    const {id, datetime} = req.query;
    if(id) {
        const ids = typeof id == "string" ? new mongoose.Types.ObjectId(id) 
        : id.map((id) => new mongoose.Types.ObjectId(id))
        arg = {$or: [{timetableId: {$in: ids}}, {userId: {$in: ids}}, {_id: {$in: ids}}]}
    }

    if (datetime) {
        const start = new Date(datetime.startDatetime)
        const end = new Date(datetime.endDatetime)
        arg = {...arg, datetime: {$gte: start.toISOString(), $lte: end.toISOString()}}
    }

    const attendances = await Attendance.find(arg)

    res.status(200).json(attendances)
})

/**
 * ziskat uzivatele z classId pokud neni tak supl
 * 
 * @desc Create Attendances
 * @route POST /api/Attendances
 * @access Private
 */
const setAttendance = asyncHandler(async (req, res) => {
    if(!req.body.datetime){
        res.status(400)
        throw new Error("Please add datetime")
    }

    const attendance = await Attendance.create(req.body)

    res.status(200).json(attendance)
})

/** 
 * @desc Update Attendances
 * @route PUT /api/Attendances/:id
 * @access Private
 */
const updateAttendance = asyncHandler(async (req, res) => {
    const attendance = await Attendance.findById(req.params.id)

    if(!attendance) {
        res.status(400)
        throw new Error("Attendance not find")
    }

    const updatedAttendance = await Attendance.findByIdAndUpdate(req.params.id, {new: true})

    res.status(200).json(updatedAttendance)
})

/**
 * @desc Delete Attendances
 * @route DELETE /api/Attendances/:id
 * @access Private
 */
const deleteAttendance = asyncHandler(async (req, res) => {
    const attendance = await Attendance.findById(req.params.id)

    if(!attendance) {
        res.status(400)
        throw new Error("Attendance not find")
    }

    await attendance.remove()

    res.status(200).json({id: req.params.id})
})

module.exports = {
    getAttendances,
    setAttendance,
    updateAttendance,
    deleteAttendance
}