const express = require("express");
const router = express.Router();
const {
  getTimetables,
  setTimetable,
  updateTimetable,
  deleteTimetable,
} = require("../controllers/timetableController");

const { authenticate } = require("../middleware/authenticateMiddleware");
const { authorize } = require("../middleware/authorizeMiddleware");

router.use(authenticate);

router
  .route("/")
  .get(authorize("timetablesGet"), getTimetables)
  .post(authorize("timetablesManagement"), setTimetable);
router
  .route("/:id")
  .delete(authorize("timetablesManagement"), deleteTimetable)
  .put(authorize("timetablesManagement"), updateTimetable);

module.exports = router;
