const Review = require('../models/Review');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const { error } = require('winston');

class OrderService {
  async createOrder(userId, shippingDetails) {
    const cart = await Cart.findOne({ userId, isPaid: false }).populate('items.productId');
    if (!cart?.items?.length) {
      throw new Error('Cart is empty');
    }
    const orderItems = cart.items.map((item) => ({
      productId: item.productId._id,
      quantity: item.quantity,
      price: item.productId.price,
    }));
    return Order.create({
      userId,
      items: orderItems,
      totalAmount: cart.total,
      shippingDetails: JSON.stringify(shippingDetails),
      status: 'pending',
    });
  }

  async updateAverageRating(productId) {
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
      throw new Error(error.message);
    }
  }

  addReview = async (userId, productId, rating, comment, images) => {
    try {
      // Tìm đơn hàng của người dùng chứa sản phẩm cụ thể với trạng thái "completed"
      const order = await Order.findOne({
        userId,
        'items.productId': productId,
        status: 'completed',
        'items.reviewStatus': 'not-reviewed',
      });

      if (!order) {
        return { error: true, message: 'Bạn phải hoàn tất đơn hàng và nhận sản phẩm để đánh giá.' };
      }

      const orderItem = order.items.find((item) => item.productId.toString() === productId && item.reviewStatus === 'not-reviewed');

      if (!orderItem) {
        return { error: true, message: 'Sản phẩm này đã được đánh giá hoặc không hợp lệ.' };
      }

      console.log('Order item:', orderItem);
      console.log(userId, productId, rating, comment, images);
      // Thêm review
      const review = new Review({
        userId,
        productId,
        rating,
        comment,
        images,
      });

      console.log('Review:', review);
      await review.save();

      console.log('Order item:', orderItem);

      // Cập nhật trạng thái review của sản phẩm trong đơn hàng
      orderItem.reviewStatus = 'reviewed';
      await order.save();

      // Cập nhật điểm đánh giá trung bình cho sản phẩm
      await this.updateAverageRating(productId);

      return { error: false, message: 'Đánh giá đã được thêm thành công!' };
    } catch (error) {
      return { error: true, message: 'Có lỗi xảy ra khi thêm đánh giá.', details: error.message };
    }
  };

  getReviews = async (productId, filter) => {
    try {
      const queryConditions = { productId };
      const filterValue = Number(filter);

      if (Number.isFinite(filterValue)) {
        queryConditions.rating = Number(filterValue);
      } else if (filter === 'comments') {
        queryConditions.comment = { $exists: true, $ne: '' };
      } else if (filter === 'images-videos') {
        queryConditions.images = { $exists: true, $ne: [] };
      }
      const reviews = await Review.find(queryConditions)
        .populate({
          path: 'userId',
          select: 'fullName avatar',
        })
        .sort({ likes: -1, createdAt: -1 });
      if (!reviews || reviews.length === 0) {
        return { reviews: [] };
      }
      return {
        reviews: reviews.map((review) => ({
          ...review._doc,
          userName: review.userId.fullName,
          avatar: review.userId.avatar,
        })),
      };
    } catch (error) {
      throw new Error(error.message);
    }
  };

  getAllReviewStats = async (productId) => {
    try {
      const reviews = await Review.find({ productId });
      if (!reviews || reviews.length === 0) {
        return {
          totalReviews: 0,
          starCounts: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
          withComment: 0,
          withMedia: 0,
          totalLikes: 0,
        };
      }

      const stats = {
        totalReviews: reviews.length,
        starCounts: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
        withComment: 0,
        withMedia: 0,
      };

      reviews.forEach((review) => {
        if (review.rating) {
          stats.starCounts[review.rating] = (stats.starCounts[review.rating] || 0) + 1;
        }
        if (review.comment) {
          stats.withComment++;
        }
        if (review.images && review.images.length > 0) {
          stats.withMedia++;
        }
      });

      return stats;
    } catch (error) {
      throw new Error(error.message);
    }
  };
}

module.exports = new OrderService();
