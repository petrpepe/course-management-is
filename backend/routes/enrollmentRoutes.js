const express = require("express");
const router = express.Router();
const {
  getEnrollments,
  setEnrollment,
  updateEnrollment,
  deleteEnrollment,
} = require("../controllers/enrollmentController");

const { authenticate } = require("../middleware/authenticateMiddleware");
const { authorize } = require("../middleware/authorizeMiddleware");

router.use(authenticate);

router
  .route("/")
  .get(authorize("enrollmentsGet"), getEnrollments)
  .post(authorize("enrollmentsManagement"), setEnrollment);
router
  .route("/:id")
  .delete(authorize("enrollmentsManagement"), deleteEnrollment)
  .put(authorize("enrollmentsManagement"), updateEnrollment);

module.exports = router;
