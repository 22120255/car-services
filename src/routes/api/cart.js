const express = require('express');
const router = express.Router();

const cartController = require('../../controllers/CartController');
const { isAuthenticated } = require('../../middleware/authMiddleware');

router.get('/data', isAuthenticated, cartController.getCartData);
router.post('/add/:productId', isAuthenticated, cartController.addToCart);
router.patch('/update/status/:cartId', isAuthenticated, cartController.updatePaymentStatus);
router.patch('/update/quantity/:productId', isAuthenticated, cartController.updateQuantity);
router.delete('/remove/:productId', isAuthenticated, cartController.removeItemFromCart);

module.exports = router;
