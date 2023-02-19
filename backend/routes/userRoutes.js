const express = require('express')
const router = express.Router()
const { getUsers, registerUser, loginUser, updateUser, getMe } = require("../controllers/userController")
const { authenticate, authorize } = require('../middleware/authMiddleware')

router.post("/", registerUser)
router.post("/login", loginUser)
router.get("/me", authorize, getMe)
router.get("/all", authenticate, getUsers)
router.put("/:id", authenticate, updateUser)

module.exports = router