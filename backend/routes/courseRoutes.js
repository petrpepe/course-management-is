const express = require('express')
const router = express.Router()
const { getCourses, getCourseById, setCourse, updateCourse, deleteCourse } = require('../controllers/courseController')

const { authenticate } = require("../middleware/authMiddleware")

router.route("/").get(authenticate, getCourses).post(authenticate, setCourse)
router.route("/:id").get(authenticate, getCourseById).delete(authenticate, deleteCourse).put(authenticate, updateCourse)

module.exports = router