const express = require('express')
const router = express.Router()
const { getRoles, setRole, updateRole, deleteRole } = require('../controllers/roleController')

const { authenticate } = require("../middleware/authMiddleware")

router.use(authenticate)

router.route("/").get(getRoles).post(setRole)
router.route("/:id").delete(deleteRole).put(updateRole)

module.exports = router