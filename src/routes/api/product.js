const express = require('express');
const router = express.Router();

const { isAuthenticated } = require('../../middleware/authMiddleware');
const { checkRole } = require('../../middleware/authMiddleware');
const { uploadImage } = require('../../config/multer');
const productController = require('../../controllers/ProductController');

router.get('/', productController.productsAndGetProducts);

module.exports = router;
