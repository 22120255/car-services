const express = require('express')
const router = express.Router()

const paymentController = require('../../controllers/PaymentController')
const { isAuthenticated } = require('../../middleware/authMiddleware')

router.get('/:cartID', isAuthenticated, paymentController.payment)

module.exports = router;
