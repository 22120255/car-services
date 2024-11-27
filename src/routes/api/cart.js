const express = require('express')
const router = express.Router()

const cartController = require('../../controllers/CartController')
const { isAuthenticated } = require('../../middleware/authMiddleware')

router.post('/add/:productId', isAuthenticated, cartController.addToCart)

module.exports = router
