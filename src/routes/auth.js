const express = require("express");
const router = express.Router();

const authController = require("../controllers/AuthController");

router.get("/login", authController.login);
router.get("/register", authController.register);
router.get("/forgot-password", authController.forgotPassword);

module.exports = router;
