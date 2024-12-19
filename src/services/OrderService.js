const Review = require('../models/Review');
const Product = require('../models/Product');
const Order = require('../models/Order');

class OrderService {
  updateAverageRating = async (productId) => {
    try {
      const reviews = await Review.find({ productId });
      if (reviews.length === 0) {
        return 0;
      }
      const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
      const averageRating = totalRating / reviews.length;
      const numReviews = reviews.length;
      await Product.findByIdAndUpdate(productId, { averageRating });
      return numReviews;
    } catch (error) {
      throw new Error(error);
    }
  };

  addReview = async (userId, productId, rating, comment, images) => {
    try {
      // Tìm đơn hàng của người dùng chứa sản phẩm cụ thể với trạng thái "completed"
      const order = await Order.findOne({
        userId,
        'items.productId': productId,
        status: 'completed',
        'items.reviewStatus': 'not-reviewed', // Kiểm tra trạng thái review của sản phẩm
      });

      if (!order) {
        return { error: true, message: 'Bạn phải hoàn tất đơn hàng và nhận sản phẩm để đánh giá.' };
      }

      // Tìm sản phẩm trong danh sách items
      const orderItem = order.items.find((item) => item.productId.toString() === productId && item.reviewStatus === 'not-reviewed');

      if (!orderItem) {
        return { error: true, message: 'Sản phẩm này đã được đánh giá hoặc không hợp lệ.' };
      }

      // Thêm review
      const review = new Review({
        userId,
        productId,
        rating,
        comment,
        images,
      });
      await review.save();

      // Cập nhật trạng thái review của sản phẩm trong đơn hàng
      orderItem.reviewStatus = 'reviewed';
      await order.save();

      // Cập nhật điểm đánh giá trung bình cho sản phẩm
      await updateAverageRating(productId);

      return { error: false, message: 'Đánh giá đã được thêm thành công!' };
    } catch (error) {
      return { error: true, message: 'Có lỗi xảy ra khi thêm đánh giá.', details: error.message };
    }
  };

  getReviews = async (productId) => {
    try {
      const reviews = await Review.find({ productId }).sort({ createdAt: -1 });
      if (!reviews) {
        return [];
      }
      return reviews;
    } catch (error) {
      throw new Error(error);
    }
  };
}

module.exports = new OrderService();
