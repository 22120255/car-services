const Review = require('../models/Review');
const Product = require('../models/Product');
const Order = require('../models/Order');

class OrderService {
  addReview = async (userId, orderId, reviewData) => {
    try {
      const order = await Order.findOne({
        userId,
      });
    } catch (error) {
      throw new Error(error);
    }
  };
  updateAverageRating = async (productId) => {
    try {
      const reviews = await Review.find({ productId });
      const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
      const averageRating = totalRating / reviews.length;
      await Product.findByIdAndUpdate(productId, { averageRating });
      return averageRating;
    } catch (error) {
      throw new Error(error);
    }
  };
}

module.exports = new OrderService();
