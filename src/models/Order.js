const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    total_amount: { type: Number, required: true },
    shipping_details: { type: String, required: true },
    status: {
        type: String,
        enum: ['pending', 'completed', 'canceled'],
        default: 'pending',
    },
}, {timestamps: true})

module.exports = mongoose.model('Order', orderSchema, 'orders')
