const express = require('express')
const router = express.Router()
const { getPermissons, setPermisson, updatePermisson, deletePermisson } = require('../controllers/permissionController')

const { authenticate } = require("../middleware/authMiddleware")

router.use(authenticate)

router.route("/").get(getPermissons).post(setPermisson)
router.route("/:id").delete(deletePermisson).put(updatePermisson)

module.exports = router