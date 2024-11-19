const mongoose = require('mongoose')

const reviewSchema = new mongoose.Schema({
    product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'products' },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    rating: { type: Number, required: true },
    comment: { type: String },
}, {timestamps: true})

module.exports = mongoose.model('Review', reviewSchema, 'reviews' )
