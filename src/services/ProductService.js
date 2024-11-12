const Product = require('../models/Product');
const { multipleMongooseToObject } = require('../utils/mongoose');

class ProductService {
    // [GET] /products/filter
    getFilteredProducts = async (query) => {
        try {
            const products = await Product.find(query);
            return products;
        }
        catch (error) {
            throw new Error(error);
        }
    }
    getDetail = async (query) => {
        try {
            const product = await Product.findById(query);
            return product;
        }
        catch (error) {
            throw new Error(error);
        }
    }
}

module.exports = new ProductService();