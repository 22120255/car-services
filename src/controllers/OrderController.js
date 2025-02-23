const Order = require('../models/Order');
const Cart = require('../models/Cart');
const PaymentController = require('./PaymentController');
const OrderService = require('../services/OrderService');

class OrderController {
  async createOrder(req, res) {
    try {
      const order = await OrderService.createOrder(req.user._id, req.body.shippingDetails);
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
      const { productId, rating, comment, images, orderId } = req.body;
      const userId = req.user._id; // Lấy ID người dùng từ middleware xác thực

      console.log('orderId', orderId);
      // Gọi service để thêm review
      const result = await OrderService.addReview(userId, productId, rating, comment, images, orderId);

      console.log('Result:', result);
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
