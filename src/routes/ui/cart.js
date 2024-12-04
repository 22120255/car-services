const express = require('express')
const router = express.Router()

const cartController = require('../../controllers/CartController');
const { isAuthenticated } = require('../../middleware/authMiddleware')

router.get('/payment/:cartID', isAuthenticated, cartController.payment)
router.get('/', isAuthenticated, cartController.cart)

module.exports = router
