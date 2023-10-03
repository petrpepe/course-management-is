const express = require('express')
const router = express.Router()
const { getProviders, setProvider, updateProvider, deleteProvider } = require('../controllers/providerController')

const { authenticate, authorize } = require("../middleware/authMiddleware")

router.use(authenticate)

router.route("/").get(authorize("providerGet"), getProviders).post(authorize("providersManagement"), setProvider)
router.route("/:id").delete(authorize("providersManagement"), deleteProvider).put(authorize("providersManagement"), updateProvider)

module.exports = router