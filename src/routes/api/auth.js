const express = require('express')
const router = express.Router()

const authController = require('../../controllers/AuthController')
const { isAuthenticated } = require('../../middleware/authMiddleware')

//Function login
router.post("/login/email/verify", authController.verifyEmail);
//Function register
router.get("/check-email", authController.checkEmail);
router.post("/register/email/store", authController.storeEmail);
router.post("/register/google/store", authController.registerWithGoogle);
router.post("/register/facebook/store", authController.registerWithFacebook);
//Function forgot password
router.post("/forgot-password/send-code", authController.sendVerificationCode);
router.post("/reset-password", authController.resetPassword);
router.patch("/change-password", isAuthenticated, authController.changePassword);
//Function resend activation link
router.post("/resend-activation-link", authController.resendActivationLink);

module.exports = router