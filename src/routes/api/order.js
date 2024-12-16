const express = require('express');
const router = express.Router();

const OrderController = require('../../controllers/OrderController');
const { isAuthenticated } = require('../../middleware/authMiddleware');

// Create order
router.post('/create', isAuthenticated, OrderController.createOrder);

module.exports = router;
