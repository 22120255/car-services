const Product = require('../models/Product')
const { multipleMongooseToObject } = require('../utils/mongoose')

class ProductService {
    getFilteredProducts = async (query) => {
        try {
            const products = await Product.find(query)
            return products
        } catch (error) {
            throw new Error(error)
        }
    }
    getDetail = async (query) => {
        try {
            const product = await Product.findById(query)
            return product
        } catch (error) {
            throw new Error(error)
        }
    }
    getPaginatedProducts = async (query, page, limit) => {
        try {
            const products = await Product.find(query)
                .skip(limit * page - limit)
                .limit(limit)
                .exec()

            // Get the total count of products for pagination
            const count = await Product.countDocuments(query)

            return {
                products,
                total: count,
            }
        } catch (error) {
            throw new Error(error)
        }
    }
}

module.exports = new ProductService()
