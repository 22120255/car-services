const express = require('express')
const router = express.Router()

const paymentController = require('../../controllers/PaymentController')

router.get('/:cartID', paymentController.payment)

module.exports = router;
