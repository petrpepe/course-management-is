const express = require('express')
const router = express.Router()
const { getLessons, setLesson, updateLesson, deleteLesson } = require('../controllers/lessonController')

const { authenticate } = require("../middleware/authMiddleware")

router.route("/").get(authenticate, getLessons).post(authenticate, setLesson)
router.route("/:id").delete(authenticate, deleteLesson).put(authenticate, updateLesson)

module.exports = router