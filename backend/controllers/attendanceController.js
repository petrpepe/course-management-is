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

    if (req.userRoles.includes("admin")) arg = {}
    if (req.userRoles.includes("student"))  arg = {attendees: {$elemMatch: {user: req.user._id}}}
    if (req.userRoles.includes("lector")) {
        const classes = await Class.find({lectors: req.user._id}).select("_id")
        arg = {...arg, classId: {$in: classes}}
    }

    if(req.query.itemId) arg = {...arg, $or: [{classId: req.query.itemId},{attendees: {$elemMatch: {user: req.query.itemId}}}]}

    const attendances = await Attendance.find(arg)

    let editableAttendances = JSON.parse(JSON.stringify(attendances))
    if (req.query.names) {
        let classIds = []
        let lessonIds = []
        let userIds = []
        attendances.map(att => {
            classIds.push(att.classId)
            lessonIds.push(att.lessonId)
            att.attendees.map(userId => userIds.push(userId.user))
        })

        const classNames = await Class.find({_id: {$in: classIds}}).select("_id title")
        const lessonNames = await Lesson.find({_id: {$in: lessonIds}}).select("_id title duration")
        const userNames = await User.find({_id: {$in: userIds}}).select("_id lastName firstName")

        editableAttendances.map(att => {
            if(classNames.length > 0)att.classId = classNames.filter(className => className._id == att.classId)[0].title
            const lesson = lessonNames.filter(lessonName => lessonName._id == att.lessonId)[0]
            if(lessonNames.length > 0 && lesson) att.lessonId = {id: lesson._id, title: lesson.title, duration: lesson.duration}
            att.attendees = att.attendees.map(attendee => {
                let filtUserName = userNames.filter(userName => userName._id == attendee.user)[0]
                if (filtUserName) {
                    attendee.name = filtUserName.lastName + " " + filtUserName.firstName
                    return attendee
                } else return null
            }).filter(att => att != null)
        })
    }

    res.status(200).json(editableAttendances)
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

    const attendees = attendance.attendees.map(att => {
        if(att.user.equals(req.body.userId)) att.attType = req.body.attType
        return att
    })

    const updatedAttendance = await Attendance.findByIdAndUpdate(req.params.id, 
        {$set: {attendees: attendees}}, {new: true})

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