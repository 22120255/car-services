const express = require('express');
const router = express.Router();

const { isAuthenticated } = require('../../middleware/authMiddleware');
const { checkRole } = require('../../middleware/authMiddleware');
const { uploadImage } = require('../../config/multer');
const productController = require('../../controllers/ProductController');

// /api/products/related/:by
router.get('/related/:id/', productController.getRelatedProducts);

// /api/products/reviews/stats
router.get('/reviews/filter/:id', productController.statsReviews);

// /api/products/reviews/:id
router.get('/reviews/:id', productController.getReviews);

router.get('/', productController.productsAndGetProducts);

module.exports = router;
