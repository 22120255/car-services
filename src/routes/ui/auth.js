const express = require('express')
const router = express.Router()


const authController = require('../../controllers/AuthController')

router.get("/login", authController.login);
//Function register
router.get("/register", authController.register);
router.get("/activate", authController.activateAccount);
//Function forgot password
router.get("/forgot-password", authController.forgotPassword);

module.exports = router