const express = require('express');
const router = express.Router();

const cartController = require('../../controllers/CartController');
const { isAuthenticated } = require('../../middleware/authMiddleware');

router.get('/data', cartController.getCartData);
router.post('/add/:productId', cartController.addToCart);
router.patch('/update/status/:cartId', isAuthenticated, cartController.updatePaymentStatus);
router.patch('/update/quantity/:productId', cartController.updateQuantity);
router.delete('/remove/:productId', cartController.removeItemFromCart);

module.exports = router;
