const express = require('express')
const router = express.Router()

const paymentController = require('../../controllers/PaymentController')

router.get('/createQR', paymentController.createQR);

module.exports = router
