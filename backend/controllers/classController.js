const asyncHandler = require('express-async-handler')
const Class = require('../models/classModel');
const Lesson = require('../models/lessonModel');
const Timetable = require('../models/timetableModel');
const Enrollment = require('../models/enrollmentModel');
const mongoose = require("mongoose")

/**
 * @desc Get Classes
 * @route GET /api/Classes
 * @access Private
 */
const getClasses = asyncHandler(async (req, res) => {
    let arg = {}
//zápis enrollments
    if(req.query.id && req.query.id != null) {
        const ids = Array.isArray(req.query.id) ? req.query.id.map((id) => new mongoose.Types.ObjectId(id)) : req.query.id.split(",").map((id) => new mongoose.Types.ObjectId(id))
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
    const {title} = req.body
    if(!title){
        res.status(400)
        throw new Error("Please add title")
    }

    req.body.course = new mongoose.Types.ObjectId(req.body.course)

    const lessons = await Lesson.find({course: req.body.course}).select("-content")
    const classVar = await Class.create(req.body)

    let timetables = []
    for (let i = 1; i <= lessons.length; i++) {
        const timetable = {datetime: classVar.startDateTime, classId: classVar._id, lesson: lessons.filter(l => l.lessonNum === i)[0]._id, lector: classVar.lectors}
        const datetime = new Date(classVar.startDateTime)
        timetable.datetime = datetime.setDate(datetime.getDate() + 7 * i)
        timetables.push(timetable)
    }

    await Timetable.create(timetables)

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

    if (!classVar.course.equals(updatedClass.course)) {
        req.body.course = mongoose.Types.ObjectId(req.body.course)
        const lessons = (await Lesson.find({course: req.body.course})).sort()

        for (let i = 1; i <= lessons.length; i++) {
            const timetable = {datetime: updatedClass.startDateTime, classId: updatedClass._id, 
                lesson: lessons.filter(l => l.lessonNum === i)._id, lector: updatedClass.lectors}
            const datetime = new Date(updatedClass.startDateTime)
            timetable.datetime = datetime.setDate(datetime.getDate() + 7 * i)

            await Timetable.update({$and: [{classId: timetable.classId}, {lesson: timetable.lesson}]}, timetable)
        }
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

    await Enrollment.deleteMany({classId: classVar._id.toString()})
    const timetables = await Timetable.deleteMany({classId: classVar._id.toString()})
    await Attendance.deleteMany({timetableId: {$in: timetables.map(t => t._id.toString())}})

    await classVar.deleteOne()

    res.status(200).json({id: req.params.id})
})

module.exports = {
    getClasses,
    setClass,
    updateClass,
    deleteClass
}