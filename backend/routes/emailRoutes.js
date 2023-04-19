const express = require('express')
const router = express.Router()
const { authenticate, authorize } = require("../middleware/authMiddleware")
const { sendEmail } = require("../controllers/emailController")

router.use(authenticate)
router.use(authorize("sendEmails"))

router.route("/").post(async (req, res) => {
    const { from, to, replyTo, subject, content } = req.body
  
    try {
        await sendEmail(from, to, replyTo, subject, content);

        res.status(200).json({ success: true, message: "Email Sent" });
    } catch (error) {
        res.status(500).json(error.message);
    }
})

module.exports = router