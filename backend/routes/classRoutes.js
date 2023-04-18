const express = require('express')
const router = express.Router()
const { getClasses, setClass, updateClass, deleteClass } = require('../controllers/classController')

const { authenticate } = require("../middleware/authMiddleware")

router.use(authenticate)

router.route("/").get(getClasses).post(setClass)
router.route("/:id").put(updateClass).delete(deleteClass)

module.exports = router