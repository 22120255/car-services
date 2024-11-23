const Product = require('../models/Product')
const { multipleMongooseToObject } = require('../utils/mongoose')

class DashboardService {
    // Find the most bought products
    getMostAndNewBoughtProducts = async (query) => {
        try {
            const mostProducts = await Product.find().limit(3)
            const newProducts = await Product.find(query).limit(3)
            return { mostProducts, newProducts }
        } catch (error) {
            throw new Error(error)
        }
    }
}

module.exports = new DashboardService()
