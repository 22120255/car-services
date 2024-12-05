const Product = require('../models/Product');
const Cart = require('../models/Cart');
const { errorLog } = require('../utils/customLog');

class CartController {
  payment(req, res) {
    res.render('shops-cart/payment', {
      layout: false,
    });
  }
  async createQR(req, res) {
    try {
      let userId = req.user._id;
      const cart = await Cart.findOne({ userId });

      if (!cart) {
        errorLog('CartController.js', 'createQR', 'Cart not found');
        return res.status(400).json({ message: 'Cart not found.' });
      }

      const amount = cart.total;
      const cartID = cart._id;
      userId = userId.toString().slice(-4) + 'XXXX';
      const description = `KH ${userId} TT ${cartID}`;
      // QR code quick link
      const QR = `https://img.vietqr.io/image/${process.env.BANK_ID}-${process.env.ACCOUNT_NO}-compact2.png?amount=${amount}&addInfo=${description}&accountName=${process.env.ACCOUNT_NAME}`;

      return res.status(200).json({ QR });
    } catch (error) {
      errorLog('CartController.js', 'createQR', error.message);
      return res.status(500).json({ message: 'Server error occurred.' });
    }
  }
  cart(req, res) {
    res.render('shops-cart/index', {
      title: 'Shopping Cart',
    });
  }

  async getCartData(req, res) {
    try {
      const userId = req.user._id;
      const cart = await Cart.findOne({ userId, isPaid: false }).populate('items.productId');

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
      const userId = req.user._id;
      const { productId } = req.params;
      const quantity = parseInt(req.body.quantity);

      let cart = await Cart.findOne({ userId, isPaid: false });
      if (!cart) {
        cart = new Cart({
          userId,
          items: [],
          total: 0,
        });
      }

      const existingItem = cart.items.find((item) => {
        const itemProductId = item.productId instanceof Object ? item.productId.toString() : item.productId;
        return itemProductId === productId;
      });
      console.log('existingItem', existingItem);
      if (existingItem) {
        existingItem.quantity += quantity;
        cart.total += existingItem.price * quantity;
      } else {
        const product = await Product.findById(productId);

        cart.items.push({
          productId,
          quantity: quantity,
          price: product.price,
        });
        cart.total += product.price * quantity;
      }
      await cart.save();
      req.flash('success', 'Added to cart');
      res.redirect('back');
    } catch (error) {
      errorLog('CartController.js', 'addToCart', error.message);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  async updateQuantity(req, res) {
    try {
      const { cartId, newQuantity } = req.body;
      const { productId } = req.params;

      // Ensure the quantity is valid
      if (newQuantity <= 0) {
        return res.status(400).json({ message: 'Quantity must be greater than 0' });
      }

      // Find the cart
      let cart = await Cart.findOne({ _id: cartId }).populate('items.productId');
      if (!cart) {
        return res.status(404).json({ message: 'Cart not found' });
      }

      // Find the product in the cart items
      const item = cart.items.find((item) => item.productId._id.toString() === productId);
      if (!item) {
        return res.status(404).json({ message: 'Product not found in cart' });
      }

      // Update the quantity and recalculate the total
      item.quantity = newQuantity;
      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }

      // Recalculate the total price
      cart.total = cart.items.reduce((total, item) => total + item.quantity * item.price, 0);

      // Save the updated cart
      await cart.save();
      return res.status(200).json({ message: 'Cart updated successfully', cart });
    } catch (error) {
      errorLog('CartController.js', 'updateQuantity', error.message);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  async removeItemFromCart(req, res) {
    try {
      const { productId } = req.params;
      const { cartId } = req.query;

      if (!cartId || !productId) {
        return res.status(400).json({ message: 'Invalid request data: cartId or productId missing' });
      }

      const cart = await Cart.findOne({ _id: cartId }).populate('items.productId');
      if (!cart) {
        return res.status(404).json({ message: 'Cart not found' });
      }

      const removedItemIndex = cart.items.findIndex((item) => item.productId._id.toString() === productId);
      if (removedItemIndex === -1) {
        return res.status(404).json({ message: 'Product not found in cart' });
      }

      const removedItem = cart.items[removedItemIndex];
      cart.total -= removedItem.price * removedItem.quantity;
      cart.items.splice(removedItemIndex, 1);

      await cart.save();
      return res.status(200).json({ message: 'Item removed from cart successfully', cart });
    } catch (error) {
      errorLog('cartController.js', 'removeItemFromCart', error.message);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  async updatePaymentStatus(req, res) {
    try {
      const { cartId } = req.params;
      const { isPaid } = req.body;

      const cart = await Cart.findOne({ _id: cartId });

      if (!cart) {
        errorLog('CartController.js', 'updatePaymentStatus', error.message);
        return res.status(404).json({ message: 'Cart not found' });
      }

      cart.isPaid = isPaid;
      await cart.save();
      return res.status(200).json({ message: 'Update cart payment status successful' });
    } catch (error) {
      errorLog('CartController.js', 'updatePaymentStatus', error.message);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
}

module.exports = new CartController();
