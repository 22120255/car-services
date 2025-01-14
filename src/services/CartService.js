const Cart = require('../models/Cart');
const Product = require('../models/Product');

class CartService {
  async getCart(userId, sessionId) {
    const query = { isPaid: false };
    
    // Nếu có userId thì tìm theo userId
    if (userId) {
      query.userId = userId;
    }
    // Nếu không có userId nhưng có sessionId thì tìm theo sessionId 
    else if (sessionId) {
      query.sessionId = sessionId;
    }
  
    return Cart.findOne(query).populate('items.productId');
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

    // Tìm item trong cart với productId tương ứng
    const existingItemIndex = cart.items.findIndex(item => 
      (item.productId?._id || item.productId).toString() === productId.toString()
  );

  if (existingItemIndex !== -1) {
      // Nếu sản phẩm đã tồn tại, cập nhật số lượng
      cart.items[existingItemIndex].quantity += quantity;
      
      // Cập nhật tổng tiền
      const itemPrice = cart.items[existingItemIndex].price;
      cart.total += itemPrice * quantity;
  } else {
      // Nếu là sản phẩm mới
      const product = await Product.findById(productId);
      if (!product) {
          throw new Error('Product not found');
      }

      // Thêm sản phẩm mới vào cart
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
    const sessionCart = await Cart.findOne({ sessionId: sessionId });
    const userCart = await Cart.findOne({ userId: userId, isPaid: false });

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
  }
}

module.exports = new CartService();