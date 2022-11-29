const express = require('express')
const router = express.Router()
const { getCourse, setCourse, updateCourse, deleteCourse } = require('../controllers/courseController')

router.route("/").get(getCourse).post(setCourse)
router.route("/:id").delete(deleteCourse).put(updateCourse)

module.exports = router