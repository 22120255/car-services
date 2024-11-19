const express = require('express')
const router = express.Router()

const cartController = require('../controllers/CartController')

router.get('/', cartController.getCart)
router.post('/add/:product_id', cartController.addToCart)

module.exports = router