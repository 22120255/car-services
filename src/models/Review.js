const mongoose = require('mongoose')

const ReviewSchema = new mongoose.Schema({
    product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    rating: { type: Number, required: true },
    comment: { type: String },
    created_at: { type: Date, default: Date.now },
})

module.exports = mongoose.model('Review', ReviewSchema)
