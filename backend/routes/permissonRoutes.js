const express = require('express')
const router = express.Router()
const { getPermissons, setPermisson, updatePermisson, deletePermisson } = require('../controllers/PermissonController')

const { authenticate } = require("../middleware/authMiddleware")

router.route("/").get(authenticate, getPermissons).post(authenticate, setPermisson)
router.route("/:id").delete(authenticate, deletePermisson).put(authenticate, updatePermisson)

module.exports = router