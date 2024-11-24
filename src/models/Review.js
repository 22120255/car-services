const mongoose = require('mongoose')

const reviewSchema = new mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'products' },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    rating: { type: Number, required: true },
    comment: { type: String },
}, { timestamps: true })

module.exports = mongoose.model('Review', reviewSchema, 'reviews')
