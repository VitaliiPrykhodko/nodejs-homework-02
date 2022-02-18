const express = require("express");
const router = express.Router();

const { authenticate, upload } = require('../../middlewares')
const ctrl = require('../../controllers/users')


router.get("/current", authenticate, ctrl.current)
router.get("/logout", authenticate, ctrl.logout)
router.patch('/:id/subscription', ctrl.updateBySubscription)
router.patch("/avatars", authenticate, upload.single("avatar"), ctrl.changeAvatar)
router.get("/verify/:verificationToken", ctrl.verifyToken)
router.post("/verify", ctrl.verifyEmail)

module.exports = router