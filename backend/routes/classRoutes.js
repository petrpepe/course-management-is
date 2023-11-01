const express = require("express");
const router = express.Router();
const {
  getClasses,
  setClass,
  updateClass,
  deleteClass,
} = require("../controllers/classController");

const { authenticate, authorize } = require("../middleware/authMiddleware");

router.use(authenticate);

router
  .route("/")
  .get(authorize("classGet"), getClasses)
  .post(authorize("classCreate"), setClass);
router
  .route("/:id")
  .put(authorize("classUpdate"), updateClass)
  .delete(authorize("classDelete"), deleteClass);

module.exports = router;
