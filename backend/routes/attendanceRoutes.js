const express = require('express')
const router = express.Router()
const { getAttendances, setAttendance, updateAttendance, deleteAttendance } = require('../controllers/attendanceController')

const { authenticate, authorize } = require("../middleware/authMiddleware")

router.use(authenticate)

router.route("/").get(authorize("attendanceGet"), getAttendances).post(authorize("attendanceCreate"), setAttendance)
router.route("/:id").delete(authorize("attendanceDelete"), deleteAttendance).put(authorize("attendanceUpdate"), updateAttendance)

module.exports = router