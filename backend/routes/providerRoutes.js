const express = require("express");
const router = express.Router();
const {
  getProviders,
  setProvider,
  updateProvider,
  deleteProvider,
} = require("../controllers/providerController");

const { authenticate } = require("../middleware/authenticateMiddleware");
const { authorize } = require("../middleware/authorizeMiddleware");

router.use(authenticate);

router
  .route("/")
  .get(authorize("providersGet"), getProviders)
  .post(authorize("providersManagement"), setProvider);
router
  .route("/:id")
  .delete(authorize("providersManagement"), deleteProvider)
  .put(authorize("providersManagement"), updateProvider);

module.exports = router;
