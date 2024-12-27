const Cart = require('../models/Cart');
const Product = require('../models/Product');

class CartService {
 async getCart(userId) {
   return Cart.findOne({ userId, isPaid: false }).populate('items.productId');
 }

 async addItem(userId, productId, quantity) {
   let cart = await this.getCart(userId);
   if (!cart) {
     cart = new Cart({ userId, items: [], total: 0 });
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
}

module.exports = new CartService();