const mongoose = require('mongoose')

const OrderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    totalAmount: { type: Number, required: true },
    shippingDetails: { type: String, required: true },
    status: {
        type: String,
        enum: ['pending', 'completed', 'canceled'],
        default: 'pending',
    },
}, {timestamps: true})

module.exports = mongoose.model('Order', OrderSchema, 'orders')
