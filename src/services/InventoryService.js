const Product = require('../models/Product')
const { multipleMongooseToObject } = require('../utils/mongoose')

class InventoryService {
    async createProduct(product) {
        try {
            await Product.create(product)
        } catch (error) {
            throw error
        }
    }
}

module.exports = new InventoryService()
