const express = require('express');
const router = express.Router();
const PaymentController = require('../../controllers/PaymentController'); // Ensure the correct path

// Tạo URL thanh toán
router.post('/create_payment_url', PaymentController.createPayment);

// IPN 
router.get('/vnpay_ipn', PaymentController.vnpayIPN);

module.exports = router;