const express = require('express')
const router = express.Router()


const authController = require('../controllers/AuthController')

router.get("/login", authController.login);
router.post("/login/email/verify", authController.verifyEmail);
//Function register
router.get("/register", authController.register);
router.get("/check-email", authController.checkEmail);
router.post("/register/email/store", authController.storeEmail);
router.get("/activate", authController.activateAccount);
router.post("/register/google/store", authController.registerWithGoogle);
router.post("/register/facebook/store", authController.registerWithFacebook);
//Function forgot password
router.get("/forgot-password", authController.forgotPassword);
router.post("/forgot-password/send-code", authController.sendVerificationCode);
router.post("/reset-password", authController.resetPassword);
//Function logout password
router.get("/logout", authController.logout);

module.exports = router
