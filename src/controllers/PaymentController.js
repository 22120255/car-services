require('dotenv').config();
const Cart = require('../models/Cart');
const { errorLog } = require('../utils/customLog');

class PaymentController {
  payment(req, res) {
    res.render('cart/payment');
  }
  async createQR(req, res) {
    try {
      let userId = req.user._id;
      const cart = await Cart.findOne({ userId });
      
      if (!cart) {
        errorLog('PaymentController.js', 11, 'Cart not found');
        return res.status(400).json({ message: 'Cart not found.' });
      }

      const amount = cart.total;
      const cartID = cart._id;
      userId = userId.toString().slice(-4) + 'XXXX';
      const description = `KH ${userId} TT ${cartID}`;
      // QR code quick link
      const QR = `https://img.vietqr.io/image/${process.env.BANK_ID}-${process.env.ACCOUNT_NO}-compact2.png?amount=${amount}&addInfo=${description}&accountName=${process.env.ACCOUNT_NAME}`;
      
      return res.status(200).json({ QR });
    }
    catch (error) {
      errorLog('PaymentController.js', 11, error.message);
      return res.status(500).json({ message: 'Server error occurred.' });
    }
  }
}
module.exports = new PaymentController();