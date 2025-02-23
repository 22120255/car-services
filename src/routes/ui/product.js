const express = require('express');
const router = express.Router();
const cacheMiddleware = require('../../middleware/cacheMiddleware');
const productController = require('../../controllers/ProductController');

router.get('/:id', cacheMiddleware, productController.getDetail);
router.get('/', productController.products);

module.exports = router;
