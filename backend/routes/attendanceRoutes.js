const express = require('express')
const router = express.Router()
const { getAttendances, setAttendance, updateAttendance, deleteAttendance } = require('../controllers/AttendanceController')

const { authenticate } = require("../middleware/authMiddleware")

router.route("/").get(authenticate, getAttendances).post(authenticate, setAttendance)
router.route("/:id").delete(authenticate, deleteAttendance).put(authenticate, updateAttendance)

module.exports = router