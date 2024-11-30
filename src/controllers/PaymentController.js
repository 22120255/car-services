require('dotenv').config();
const Cart = require('../models/Cart');

class PaymentController {
  payment(req, res) {
    res.render('payment');
  }
  async createQR(req, res) {
    try {

      const userId = req.user._id;
      const cart = await Cart.findOne({ userId });
      
      if (!cart) {
        return res.status(400).json({ message: 'Cart not found.' });
      }

      const amount = cart.total;
      const QR = `https://img.vietqr.io/image/${process.env.BANK_ID}-${process.env.ACCOUNT_NO}-compact2.png?amount=${amount}`;
      return res.status(200).json({ QR });
    }
    catch (error) {
      return res.status(500).json({ message: 'Server error occurred.' });
    }
  }
}
module.exports = new PaymentController();