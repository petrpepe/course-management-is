const express = require('express')
const router = express.Router()
const { getLessons, setLesson, updateLesson, deleteLesson } = require('../controllers/lessonController')

const { authenticate } = require("../middleware/authMiddleware")

router.use(authenticate)

router.route("/").get(getLessons).post(setLesson)
router.route("/:id").delete(deleteLesson).put(updateLesson)

module.exports = router