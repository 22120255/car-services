const express = require('express')
const router = express.Router()
const { isAuthenticated } = require('../../middleware/authMiddleware')
const authController = require('../../controllers/AuthController')

router.get("/login", authController.login);
//Function register
router.get("/register", authController.register);
router.get("/activate", authController.activateAccount);
//Function forgot password
router.get("/forgot-password", authController.forgotPassword);
//Function logout password
router.get("/logout", isAuthenticated, authController.logout);
module.exports = router