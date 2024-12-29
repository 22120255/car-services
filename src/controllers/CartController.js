const CartService = require('../services/CartService');
const { errorLog } = require('../utils/customLog');

class CartController {
  payment(req, res) {
    res.render('shops-cart/payment', { layout: false });
  }

  cart(req, res) {
    res.render('shops-cart/index', { title: 'Shopping Cart' });
  }

  async getCartData(req, res) {
    try {
      const cart = await CartService.getCart(req.user._id);
      if (!cart) {
        return res.status(404).json({ message: 'Cart not found' });
      }
      return res.status(200).json(cart);
    } catch (error) {
      errorLog('CartController.js', 'getCartData', error.message);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  async addToCart(req, res) {
    try {
      await CartService.addItem(
        req.user._id,
        req.params.productId,
        parseInt(req.body.quantity)
      );
      req.flash('success', 'Added to cart');
      res.redirect('back');
    } catch (error) {
      errorLog('CartController.js', 'addToCart', error.message);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  async updateQuantity(req, res) {
    try {
      if (req.body.newQuantity <= 0) {
        return res.status(400).json({ message: 'Quantity must be greater than 0' });
      }

      const cart = await CartService.updateQuantity(
        req.body.cartId,
        req.params.productId,
        req.body.newQuantity
      );

      return res.status(200).json({ message: 'Cart updated successfully', cart });
    } catch (error) {
      errorLog('CartController.js', 'updateQuantity', error.message);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  async removeItemFromCart(req, res) {
    try {
      if (!req.query.cartId || !req.params.productId) {
        return res.status(400).json({ message: 'Invalid request data: cartId or productId missing' });
      }

      const cart = await CartService.removeItem(req.query.cartId, req.params.productId);
      return res.status(200).json({ message: 'Item removed from cart successfully', cart });
    } catch (error) {
      errorLog('cartController.js', 'removeItemFromCart', error.message);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  async updatePaymentStatus(req, res) {
    try {
      await CartService.updatePayment(req.params.cartId, req.body.isPaid);
      return res.status(200).json({ message: 'Update cart payment status successful' });
    } catch (error) {
      errorLog('CartController.js', 'updatePaymentStatus', error.message);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
}

module.exports = new CartController();