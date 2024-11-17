const Product = require('../models/Product')
const { multipleMongooseToObject } = require('../utils/mongoose')

class DashboardService {
    // Find the most bought products
    getMostBoughtProducts = async () => {
        try {
            const products = await Product.find().limit(3)
            return products
        } catch (error) {
            throw new Error(error)
        }
    }
}

module.exports = new DashboardService()
