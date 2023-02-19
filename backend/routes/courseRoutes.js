const express = require('express')
const router = express.Router()
const { getCourses, setCourse, updateCourse, deleteCourse } = require('../controllers/courseController')

const { authenticate } = require("../middleware/authMiddleware")

router.route("/").get(authenticate, getCourses).post(authenticate, setCourse)
router.route("/:id").delete(authenticate, deleteCourse).put(authenticate, updateCourse)

module.exports = router