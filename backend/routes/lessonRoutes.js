const express = require("express");
const router = express.Router();
const {
  getLessons,
  setLesson,
  updateLesson,
  deleteLesson,
} = require("../controllers/lessonController");

const { authenticate } = require("../middleware/authenticateMiddleware");
const { authorize } = require("../middleware/authorizeMiddleware");

router.use(authenticate);

router
  .route("/")
  .get(authorize("lessonGet"), getLessons)
  .post(authorize("lessonCreate"), setLesson);
router
  .route("/:id")
  .delete(authorize("lessonDelete"), deleteLesson)
  .put(authorize("lessonUpdate"), updateLesson);

module.exports = router;
