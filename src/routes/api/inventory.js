const express = require('express')
const router = express.Router()

const adminController = require('../../controllers/AdminController')
const inventoryController = require('../../controllers/InventoryController')
const { checkRole } = require('../../middleware/authMiddleware')
const { uploadImage } = require('../../config/multer')

router.get('/', checkRole(['admin', 'sadmin']), adminController.getProducts)
router.post(
    '/add',
    checkRole(['admin', 'sadmin']),
    inventoryController.createProduct
)

module.exports = router
