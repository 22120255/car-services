const InventoryService = require('../services/InventoryService')

class InventoryController {
    // [POST] /api/inventory
    async createProduct(req, res) {
        try {
            await InventoryService.createProduct(req.body)
            return res.status(201).json({ message: 'Tạo sản phẩm thành công' })
        } catch (error) {
            errorLog('InventoryController', 36, error.message)
            return res.status(403).json({ error: error.message })
        }
    }
}

module.exports = new InventoryController()
