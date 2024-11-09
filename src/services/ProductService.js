const Product = require('../models/Product');
const { multipleMongooseToObject } = require('../utils/mongoose');

class ProductService {
    // [GET] /products/filter
    findService = async (query) => {
        try {
            const products = await Product.find(query);
            return products;
        }
        catch (error) {
            console.log(error);
        }
    }
    findOneService = async (query) => {
        try {
            const product = await Product.findById(query);
            console.log(product);
            return product;
        }
        catch (error) {
            console.log(error);
        }
    }
}

module.exports = new ProductService();