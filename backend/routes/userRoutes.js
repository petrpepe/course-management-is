const express = require('express')
const router = express.Router()
const { getUsers, createUser, loginUser, updateUser, deleteUser } = require("../controllers/userController")
const { authenticate, authorize } = require('../middleware/authMiddleware')

router.post("/login", loginUser)
router.post("/", [authenticate, authorize("userCreate")], createUser)
router.get("/all", [authenticate, authorize("userGet")], getUsers)
router.put("/:id", [authenticate, authorize("userUpdate")], updateUser).delete("/:id", [authenticate, authorize("userDelete")], deleteUser)

module.exports = router