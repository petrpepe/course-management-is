const express = require('express')
const router = express.Router()
const { getAttendances, setAttendance, updateAttendance, deleteAttendance } = require('../controllers/attendanceController')

const { authenticate } = require("../middleware/authMiddleware")

router.use(authenticate)

router.route("/").get(getAttendances).post(setAttendance)
router.route("/:id").delete(deleteAttendance).put(updateAttendance)

module.exports = router