const Review = require('../models/Review');
const Product = require('../models/Product');
const Order = require('../models/Order');

async function updateAverageRating(productId) {
  try {
    const reviews = await Review.find({ productId });
    const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
    const averageRating = totalRating / reviews.length;
    await Product.findByIdAndUpdate(productId, { averageRating });
    return averageRating;
  } catch (error) {
    throw new Error(error);
  }
}

class OrderService {
  addReview = async (userId, productId, rating, comment) => {
    try {
      // Kiểm tra xem người dùng đã mua sản phẩm và trạng thái đơn hàng là "completed"
      const order = await Order.findOne({
        userId,
        'items.productId': productId,
        status: 'completed',
        reviewStatus: 'not-reviewed',
      });

      if (!order) {
        return { error: true, message: 'Bạn phải hoàn tất đơn hàng và nhận sản phẩm để đánh giá.' };
      }

      // Thêm review
      const review = new Review({
        userId,
        productId,
        rating,
        comment,
      });
      console.log('Review:', review);
      await review.save();

      order.reviewStatus = 'reviewed';
      await order.save();

      await updateAverageRating(productId);

      return { error: false, message: 'Đánh giá đã được thêm thành công!' };
    } catch (error) {
      return { error: true, message: 'Có lỗi xảy ra khi thêm đánh giá.', details: error.message };
    }
  };
}

module.exports = new OrderService();
