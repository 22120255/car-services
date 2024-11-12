const express = require('express')
const router = express.Router()

const productController = require('../controllers/ProductController')

router.get('/:id', productController.getDetail)
router.get('/', productController.pagination)

module.exports = router
