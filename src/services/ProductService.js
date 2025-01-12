const Product = require('../models/Product');
const { multipleMongooseToObject } = require('../utils/mongoose');

class ProductService {
  getFilteredProducts = async (query) => {
    try {
      const products = await Product.find(query);
      return products;
    } catch (error) {
      throw new Error(error);
    }
  };
  getDetail = async (query) => {
    try {
      const product = await Product.findById(query);
      return product;
    } catch (error) {
      throw new Error(error);
    }
  };
  getPaginatedProducts = async (query, offset, limit, sort) => {
    try {
      const products = await Product.find(query)
        .skip(limit * offset - limit) // Phân trang
        .limit(limit) // Giới hạn số lượng sản phẩm trên mỗi trang
        .sort(sort) // Áp dụng sort theo điều kiện sort đã truyền vào
        .exec();

      // Lấy tổng số sản phẩm để hiển thị phân trang
      const count = await Product.countDocuments(query);

      return {
        products,
        total: count,
      };
    } catch (error) {
      throw new Error(error);
    }
  };
}

module.exports = new ProductService();
