const express = require('express')
const router = express.Router()

const paymentController = require('../../controllers/PaymentController')
const { isAuthenticated } = require('../../middleware/authMiddleware')

router.get('/createQR', isAuthenticated, paymentController.createQR);

module.exports = router
