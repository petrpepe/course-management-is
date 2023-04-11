const express = require('express')
const router = express.Router()
const { getUsers, registerUser, createUser, loginUser, updateUser, getMe, deleteUser } = require("../controllers/userController")
const { authenticate, authorize } = require('../middleware/authMiddleware')

router.post("/register", registerUser)
router.post("/", authenticate, createUser)
router.post("/login", loginUser)
router.get("/me", [authenticate, authorize(["userGet"])], getMe)
router.get("/all", authenticate, getUsers)
router.put("/:id", authenticate, updateUser).delete("/:id", authenticate, deleteUser)

module.exports = router