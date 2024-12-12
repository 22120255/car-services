const express = require('express');
const router = express.Router();
const PaymentController = require('../../controllers/PaymentController'); // Ensure the correct path

// Form thanh toán
router.get('/create_payment_url', PaymentController.getCreatePayment);

// Form hoàn tiền
router.get('/refund', PaymentController.getRefund);

// Tạo URL thanh toán
router.post('/create_payment_url', PaymentController.createPayment);

// Kết quả thanh toán
router.get('/VNPay_return', PaymentController.vnpayReturn);

// IPN URL
router.get('/VNPay_ipn', PaymentController.vnpayIPN);

// Truy vấn giao dịch
// Add the corresponding method in PaymentController if needed

module.exports = router;