const express = require('express')
const router = express.Router()
const { getRoles, setRole, updateRole, deleteRole } = require('../controllers/roleController')

const { authenticate, authorize } = require("../middleware/authMiddleware")

router.use(authenticate)
router.use(authorize("rolesManagement"))

router.route("/").get(getRoles).post(setRole)
router.route("/:id").delete(deleteRole).put(updateRole)

module.exports = router