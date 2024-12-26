const Order = require('../models/Order');
const Cart = require('../models/Cart');
const PaymentController = require('./PaymentController');
const OrderService = require('../services/OrderService');

class OrderController {
  async createOrder(req, res) {
    try {
      const { shippingDetails } = req.body;
      const userId = req.user._id;

      // Get cart với Mongoose
      const cart = await Cart.findOne({ userId, isPaid: false }).populate('items.productId');

      if (!cart || !cart.items || cart.items.length === 0) {
        return res.status(400).json({ error: 'Cart is empty' });
      }

      // Format items từ cart
      const orderItems = cart.items.map((item) => ({
        productId: item.productId._id,
        quantity: item.quantity,
        price: item.productId.price,
      }));

      // Tính tổng tiền
      const totalAmount = cart.total;

      // Create order với Mongoose
      const order = await Order.create({
        userId,
        items: orderItems,
        totalAmount,
        shippingDetails: JSON.stringify(shippingDetails),
        status: 'pending',
      });

      res.status(201).json({ order });
    } catch (error) {
      res.status(500).json({
        error: 'Internal Server Error',
        message: error.message,
      });
    }
  }

  async addReview(req, res) {
    try {
      const { productId, rating, comment, images } = req.body;
      const userId = req.user._id; // Lấy ID người dùng từ middleware xác thực

      // Gọi service để thêm review
      const result = await OrderService.addReview(userId, productId, rating, comment, images);

      if (result.error) {
        return res.status(400).json({ message: result.message });
      }

      return res.status(200).json({ message: result.message });
    } catch (error) {
      return res.status(500).json({ message: 'Có lỗi xảy ra khi xử lý yêu cầu.', error: error.message });
    }
  }
}

module.exports = new OrderController();
