const express = require('express')
const router = express.Router()

const cartController = require('../controllers/CartController')
const { isAuthenticated } = require('../middleware/authMiddleware')
router.get('/', cartController.cart)
router.get('/data', isAuthenticated, cartController.getCartData)
router.post('/add/:productId', isAuthenticated, cartController.addToCart)

module.exports = router
