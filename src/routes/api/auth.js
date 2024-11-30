const express = require('express')
const router = express.Router()

const { isAuthenticated } = require('../../middleware/authMiddleware')
const authController = require('../../controllers/AuthController')

router.post("/login/email/verify", authController.verifyEmail);
//Function register
router.get("/check-email", authController.checkEmail);
router.post("/register/email/store", authController.storeEmail);
router.post("/register/google/store", authController.registerWithGoogle);
router.post("/register/facebook/store", authController.registerWithFacebook);
//Function forgot password
router.post("/forgot-password/send-code", authController.sendVerificationCode);
router.post("/reset-password", authController.resetPassword);
//Function logout password
router.get("/logout", isAuthenticated, authController.logout);

module.exports = router