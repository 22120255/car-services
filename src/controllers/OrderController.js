const Order = require('../models/Order');
const Cart = require('../models/Cart');
const PaymentController = require('./PaymentController');

class OrderController {
    async createOrder(req, res) {
        try {
            console.log('createOrder called');
            const { shippingDetails } = req.body;
            const userId = req.user._id;
            console.log('User ID:', userId);

            // Get cart với Mongoose
            const cart = await Cart.findOne({ userId })
                .populate('items.productId');
            console.log('Cart:', cart);

            if (!cart || !cart.items || cart.items.length === 0) {
                console.log('Cart is empty');
                return res.status(400).json({ error: 'Cart is empty' });
            }

            // Format items từ cart
            const orderItems = cart.items.map(item => ({
                productId: item.productId._id,
                quantity: item.quantity,
                price: item.productId.price
            }));
            console.log('Order Items:', orderItems);

            // Tính tổng tiền
            const totalAmount = cart.total;
            console.log('Total Amount:', totalAmount);

            // Create order với Mongoose
            const order = await Order.create({
                userId,
                items: orderItems,
                totalAmount,
                shippingDetails: JSON.stringify(shippingDetails),
                status: 'pending'
            });
            console.log('Order created:', order);

            // Tạo URL thanh toán
            const vnpayUrl = await PaymentController.createPaymentUrl({
                orderId: order._id.toString(),
                amount: totalAmount
            });
            console.log('Payment URL:', vnpayUrl);

            // Clear cart sau khi tạo order
            // await Cart.findOneAndUpdate(
            //     { userId },
            //     { $set: { items: [] } }
            // );

            res.json({ success: true, paymentUrl: vnpayUrl });

        } catch (error) {
            console.error('Create Order Error:', error);
            res.status(500).json({ 
                error: 'Internal Server Error',
                message: error.message 
            });
        }
    }
}

module.exports = new OrderController();