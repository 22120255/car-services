const mongoose = require('mongoose');

const CartItemSchema = new mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
}, { timestamps: true });

const CartSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    items: [CartItemSchema],
    total: { type: Number, required: true, default: 0 },
    isPaid: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Cart', CartSchema, 'carts');