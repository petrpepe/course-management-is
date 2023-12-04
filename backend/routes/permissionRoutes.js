const express = require("express");
const router = express.Router();
const {
  getPermissions,
  setPermission,
  updatePermission,
  deletePermission,
} = require("../controllers/permissionController");

const { authenticate } = require("../middleware/authenticateMiddleware");
const { authorize } = require("../middleware/authorizeMiddleware");

router.use(authenticate);
router.use(authorize("permissionsManagement"));

router.route("/").get(getPermissions).post(setPermission);
router.route("/:id").delete(deletePermission).put(updatePermission);

module.exports = router;
