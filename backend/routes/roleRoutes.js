const express = require('express')
const router = express.Router()
const { getRoles, setRole, updateRole, deleteRole } = require('../controllers/RoleController')

const { authenticate } = require("../middleware/authMiddleware")

router.route("/").get(authenticate, getRoles).post(authenticate, setRole)
router.route("/:id").delete(authenticate, deleteRole).put(authenticate, updateRole)

module.exports = router