const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    rating: { type: Number, min: 1, max: 5, required: true }, // Đánh giá từ 1 đến 5 sao
    comment: { type: String, required: false }, // Nhận xét của người dùng
    images: [{ type: String }], // Mảng chứa các đường dẫn ảnh hoặc URL
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Review', ReviewSchema, 'reviews');
