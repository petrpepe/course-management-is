const express = require("express");
const router = express.Router();
const {
  getAttendances,
  setAttendance,
  updateAttendance,
  deleteAttendance,
} = require("../controllers/attendanceController");
const { getAttendanceParams } = require("../services/attendanceService");

const { authenticate } = require("../middleware/authenticateMiddleware");
const { authorize } = require("../middleware/authorizeMiddleware");

router.use(authenticate);

router
  .route("/")
  .get(authorize("attendanceGet"), getAttendanceParams, getAttendances)
  .post(authorize("attendanceCreate"), setAttendance);
router
  .route("/:id")
  .delete(authorize("attendanceDelete"), deleteAttendance)
  .put(authorize("attendanceUpdate"), updateAttendance);

module.exports = router;
