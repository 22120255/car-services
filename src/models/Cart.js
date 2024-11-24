const mongoose = require('mongoose');

const CartItemSchema = new mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'products' },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
}, { timestamps: true });

const CartSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    items: [CartItemSchema],
    total: { type: Number, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Cart', CartSchema, 'carts');