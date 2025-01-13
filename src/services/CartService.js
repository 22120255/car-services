const Cart = require('../models/Cart');
const Product = require('../models/Product');

class CartService {
  async getCart(userId, sessionId) {
    return Cart.findOne({
      $or: [
        { userId: userId },
        { sessionId: sessionId }
      ],
      isPaid: false
    }).populate('items.productId');
  }

  async addItem(userId, sessionId, productId, quantity) {
    let cart = await this.getCart(userId, sessionId);
    if (!cart) {
      cart = new Cart({ 
        userId, 
        sessionId,
        items: [], 
        total: 0 
      });
    }

    const existingItem = cart.items.find(item => {
      const itemProductId = item.productId instanceof Object ? 
        item.productId.toString() : item.productId;
      return itemProductId === productId;
    });

    if (existingItem) {
      existingItem.quantity += quantity;
      cart.total += existingItem.price * quantity;
    } else {
      const product = await Product.findById(productId);
      cart.items.push({
        productId,
        quantity,
        price: product.price
      });
      cart.total += product.price * quantity;
    }

    return cart.save();
  }

  async updateQuantity(cartId, productId, newQuantity) {
    const cart = await Cart.findOne({ _id: cartId }).populate('items.productId');
    if (!cart) throw new Error('Cart not found');

    const item = cart.items.find(item => 
      item.productId._id.toString() === productId
    );
    if (!item) throw new Error('Product not found in cart');

    item.quantity = newQuantity;
    cart.total = cart.items.reduce((sum, item) => 
      sum + item.quantity * item.price, 0
    );

    return cart.save();
  }

  async removeItem(cartId, productId) {
    const cart = await Cart.findOne({ _id: cartId }).populate('items.productId');
    if (!cart) throw new Error('Cart not found');

    const itemIndex = cart.items.findIndex(item => 
      item.productId._id.toString() === productId
    );
    if (itemIndex === -1) throw new Error('Product not found in cart');

    const item = cart.items[itemIndex];
    cart.total -= item.price * item.quantity;
    cart.items.splice(itemIndex, 1);

    return cart.save();
  }

  async updatePayment(cartId, isPaid) {
    const cart = await Cart.findOne({ _id: cartId });
    if (!cart) throw new Error('Cart not found');

    cart.isPaid = isPaid;
    return cart.save();
  }

  async mergeCartsAfterLogin(sessionId, userId) {
    try {
      const sessionCart = await Cart.findOne({ sessionId: sessionId });
      console.log('Session cart: ', sessionCart);
      const userCart = await Cart.findOne({ userId: userId, isPaid: false });
      console.log('User cart: ', userCart);

      if (!sessionCart) return;

      if (!userCart) {
        sessionCart.userId = userId;
        sessionCart.sessionId = null;
        await sessionCart.save();
        return;
      }

      for (const sessionItem of sessionCart.items) {
        const existingItem = userCart.items.find(item =>
          item.productId.toString() === sessionItem.productId.toString()
        );

        if (existingItem) {
          existingItem.quantity += sessionItem.quantity;
        } else {
          userCart.items.push(sessionItem);
        }
      }

      userCart.total = userCart.items.reduce((total, item) => 
        total + (item.price * item.quantity), 0
      );

      await userCart.save();
      await Cart.deleteOne({ _id: sessionCart._id });
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new CartService();