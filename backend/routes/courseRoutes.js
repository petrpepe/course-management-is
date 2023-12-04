const express = require("express");
const router = express.Router();
const {
  getCourses,
  setCourse,
  updateCourse,
  deleteCourse,
} = require("../controllers/courseController");

const { authenticate } = require("../middleware/authenticateMiddleware");
const { authorize } = require("../middleware/authorizeMiddleware");

router.use(authenticate);

router
  .route("/")
  .get(authorize("courseGet"), getCourses)
  .post(authorize("courseCreate"), setCourse);
router
  .route("/:id")
  .delete(authorize("courseDelete"), deleteCourse)
  .put(authorize("courseUpdate"), updateCourse);

module.exports = router;
