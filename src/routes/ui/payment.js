const express = require('express');
const router = express.Router();
const PaymentController = require('../../controllers/PaymentController'); // Ensure the correct path

// Form thanh toán
router.get('/create_payment_url', PaymentController.getCreatePayment);

// Kết quả thanh toán
router.get('/vnpay_return', PaymentController.vnpayReturn);

module.exports = router;