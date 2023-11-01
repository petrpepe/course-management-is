const express = require("express");
const router = express.Router();
const {
  getPermissions,
  setPermission,
  updatePermission,
  deletePermission,
} = require("../controllers/permissionController");

const { authenticate, authorize } = require("../middleware/authMiddleware");

router.use(authenticate);
router.use(authorize("permissionsManagement"));

router.route("/").get(getPermissions).post(setPermission);
router.route("/:id").delete(deletePermission).put(updatePermission);

module.exports = router;
