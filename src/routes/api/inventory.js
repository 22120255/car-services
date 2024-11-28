const express = require('express')
const router = express.Router()

const inventoryController = require('../../controllers/InventoryController')
const { checkRole } = require('../../middleware/authMiddleware')
const { uploadImage } = require('../../config/multer')
const UserController = require('../../controllers/UserController')

router.get('/', checkRole(['admin', 'sadmin']), UserController.getProducts)
router.post(
    '/add',
    checkRole(['admin', 'sadmin']),
    inventoryController.createProduct
)

module.exports = router
