const express = require('express')
const router = express.Router()
const { getClasses, setClass, updateClass, deleteClass } = require('../controllers/classController')

const { authenticate } = require("../middleware/authMiddleware")

router.route("/").get(authenticate, getClasses).post(authenticate, setClass)
router.route("/:id").delete(authenticate, updateClass).put(authenticate, deleteClass)

module.exports = router