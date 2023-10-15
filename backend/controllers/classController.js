const asyncHandler = require('express-async-handler')
const Class = require('../models/classModel');
const Attendance = require('../models/attendanceModel');
const User = require('../models/userModel');
const Lesson = require('../models/lessonModel');
const Timetable = require('../models/timetableModel');
const mongoose = require("mongoose")
const {sendEmail} = require("./emailController")

/**
 * @desc Get Classes
 * @route GET /api/Classes
 * @access Private
 */
const getClasses = asyncHandler(async (req, res) => {
    let arg = {}
    if (req.userRoles.includes("admin")) arg = {}
    else {
        if (req.userRoles.includes("lector")) arg = {$or: [{students: req.user._id}, {lectors: req.user._id}]}
        if (req.userRoles.includes("student") && !req.userRoles.includes("lector")) {
            arg = {students: req.user._id}
        }
    }

    if(req.query.id && req.query.id != null) {
        const ids = typeof req.query.id == "string" ? mongoose.Types.ObjectId(req.query.id) 
        : req.query.id.map((id) => mongoose.Types.ObjectId(id))
        arg = {...arg, _id: {$in: ids}}
    }

    if(req.query.keyword && req.query.keyword != null) {
        const keyword = new RegExp(".*" + req.query.keyword + ".*", "i")
        arg = {...arg, title: {$regex: keyword}}
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
 *   lessonId: lessonId z course lessons a index je to pole, 
 *   attendees: [nejdriv prazdne a pak po zapisu ucitelem],
 *   repeatCount: vytvorit attendaces s lekcemi z course jinak bez
 * }
 */
const setClass = asyncHandler(async (req, res) => {
    const {title, startDateTime, lectors} = req.body
    if(!title){
        res.status(400)
        throw new Error("Please add datetime")
    }

    req.body.course = mongoose.Types.ObjectId(req.body.course)
    const lessons = await Lesson.find({course: req.body.course})
    const classVar = await Class.create(req.body)

    let timetables = []
    for (let i = 0; i < lessons.length; i++) {
        const timetable = {dateTime: classVar.startDateTime, classId: classVar._id, lesson: lessons[i]._id, lector: classVar.lectors}
        const dateTime = new Date(classVar.startDateTime)
        timetable.dateTime = dateTime.setDate(dateTime.getDate() + 7 * i)
        timetables.push(timetable)
    }

    await Timetable.create(timetables)

    /*const users = await User.find({_id: {$in: [lectors, students].flat()}})
    
    for (const user of users) {
        try {
            await sendEmail("no-reply@noreplycris.com", user.email, "", "New account",
            "<div>" +
            "<p>Dear " + user.firstName + " " + user.lastName + ",</p>" +
            "<p>you have been assigned to class " + classVar.title + "</p>" +
            "</ br>" +
            "<p>You can <a href='" + process.env.FRONTEND_URL + "/login'>login</a> and see it in the list.</p>" +
            "<p>crsis</p>", res, false
            )
        } catch(error) {
            res.status(500);
            throw new Error(error)
        }
    }*/

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

    const updatedClass = await Class.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
    })
// Replace Zvětšit počet a změna datumu a uživatelů
    if (classVar.repeatCount !== req.repeatCount) {
        let attendances = []
        for (let i = 0; i < req.repeatCount - classVar.repeatCount; i++) {
            const attendance = {datetime: "", classId: classVar._id, lessonId: null, attendees: []}
            const attDatetime = new Date(classVar.startDateTime)
            attendance.datetime = attDatetime.setDate(attDatetime.getDate() + 7 * i + req.repeatCount)
            attendance.attendees = updatedClass.students.map(student => ({user: student.toString(), attType: ""}))
            attendance.lessonId = lessons ? lessons.filter(l => l.orderNumber === i + 1)[0]._id : null
    
            attendances.push(attendance)
        }

        //await Attendance.updateMany({classId: updatedClass._id})
    }

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

    await Attendance.deleteMany({classId: classVar._id.toString()})

    await classVar.deleteOne()

    res.status(200).json({id: req.params.id})
})

module.exports = {
    getClasses,
    setClass,
    updateClass,
    deleteClass
}