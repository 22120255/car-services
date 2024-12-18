const Order = require('../models/Order');
const Cart = require('../models/Cart');

class OrderController {
    async createOrder(req, res) {
        try {
            const { shippingDetails } = req.body;
            const userId = req.user._id;

            // Get cart với Mongoose
            const cart = await Cart.findOne({ userId, isPaid: false })
                .populate('items.productId');

            if (!cart || !cart.items || cart.items.length === 0) {
                return res.status(400).json({ error: 'Cart is empty' });
            }

            // Format items từ cart
            const orderItems = cart.items.map(item => ({
                productId: item.productId._id,
                quantity: item.quantity,
                price: item.productId.price
            }));

            // Tính tổng tiền
            const totalAmount = cart.total;

            // Create order với Mongoose
            const order = await Order.create({
                userId,
                items: orderItems,
                totalAmount,
                shippingDetails: JSON.stringify(shippingDetails),
                status: 'pending'
            });

            res.status(201).json({ order });

        } catch (error) {
            res.status(500).json({ 
                error: 'Internal Server Error',
                message: error.message 
            });
        }
    }
}

module.exports = new OrderController();