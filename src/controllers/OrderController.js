const Order = require('../models/Order');
const Cart = require('../models/Cart');
const PaymentController = require('./PaymentController');
const OrderService = require('../services/orderService');

class OrderController {
  async createOrder(req, res) {
    try {
      const { shippingDetails } = req.body;
      const userId = req.user._id;

      // Get cart với Mongoose
      const cart = await Cart.findOne({ userId }).populate('items.productId');

      if (!cart || !cart.items || cart.items.length === 0) {
        console.log('Cart is empty');
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

      // Tạo URL thanh toán
      // const vnpayUrl = await PaymentController.createPaymentUrl({
      //     orderId: order._id.toString(),
      //     amount: totalAmount
      // });
      // console.log('Payment URL:', vnpayUrl);

      // Clear cart sau khi tạo order
      // await Cart.findOneAndUpdate(
      //     { userId },
      //     { $set: { items: [] } }
      // );

      res.status(201).json({ order });
    } catch (error) {
      console.error('Create Order Error:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        message: error.message,
      });
    }
  }

  async addReview(req, res) {
    try {
      const { productId, rating, comment } = req.body;
      const userId = req.user._id; // Lấy ID người dùng từ middleware xác thực

      console.log('Review:', { userId, productId, rating, comment });
      // Gọi service để thêm review
      const result = await OrderService.addReview(userId, productId, rating, comment);

      console.log(result);
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
