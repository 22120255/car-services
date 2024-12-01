const express = require('express')
const router = express.Router()

const cartController = require('../../controllers/CartController')
const { isAuthenticated } = require('../../middleware/authMiddleware')

router.get('/data', isAuthenticated, cartController.getCartData)
router.post('/add/:productId', isAuthenticated, cartController.addToCart)
router.patch('/update/:cartID', isAuthenticated, cartController.updatePaymentStatus)

module.exports = router
