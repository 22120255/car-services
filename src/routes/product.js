const express = require('express')
const router = express.Router()

const productController = require('../controllers/ProductController')

router.get('/:page', productController.index)
router.get('/:id', productController.getDetail)
router.get('/', productController.getFilteredProducts)

module.exports = router
