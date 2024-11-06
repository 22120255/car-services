const express = require('express')
const router = express.Router()

const productController = require('../controllers/ProductController')

router.get('/detail/:id', productController.getDetail)
router.get('/:id', productController.detail)
router.get('/', productController.getFilteredProducts)


module.exports = router
