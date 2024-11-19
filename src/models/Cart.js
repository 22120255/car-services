const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
    product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'products' },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
}, {timestamps: true});

const cartSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    items: [cartItemSchema],
    total: { type: Number, required: true },
}, {timestamps: true});

module.exports = mongoose.model('Cart', cartSchema, 'carts');