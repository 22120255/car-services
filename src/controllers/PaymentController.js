require('dotenv').config();
const Cart = require('../models/Cart');

class PaymentController {
  payment(req, res) {
    res.render('payment');
  }
  async createQR(req, res) {
    try {

      let userId = req.user._id;
      const cart = await Cart.findOne({ userId });
      
      if (!cart) {
        return res.status(400).json({ message: 'Cart not found.' });
      }

      const amount = cart.total;
      const cartID = cart._id;
      userId = userId.toString().slice(-4) + 'XXXX';
      const description = `KH ${userId} TT ${cartID}`;
      const QR = `https://img.vietqr.io/image/${process.env.BANK_ID}-${process.env.ACCOUNT_NO}-compact2.png?amount=${amount}&addInfo=${description}&accountName=${process.env.ACCOUNT_NAME}`;
      return res.status(200).json({ QR });
    }
    catch (error) {
      return res.status(500).json({ message: 'Server error occurred.' });
    }
  }
}
module.exports = new PaymentController();