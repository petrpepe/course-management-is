const express = require("express");
const router = express.Router();
const {
  getUsers,
  createUser,
  loginUser,
  forgotPassword,
  setNewPassword,
  updateUser,
  deleteUser,
} = require("../controllers/userController");

const { authenticate } = require("../middleware/authenticateMiddleware");
const { authorize } = require("../middleware/authorizeMiddleware");

router.post("/login", loginUser);
router.post("/forgotPassword", forgotPassword);
router.post("/setNewPassword", setNewPassword);
router.post("/", [authenticate, authorize("userCreate")], createUser);
router.get("/all", [authenticate, authorize("userGet")], getUsers);
router
  .put("/:id", [authenticate, authorize("userUpdate")], updateUser)
  .delete("/:id", [authenticate, authorize("userDelete")], deleteUser);

module.exports = router;
