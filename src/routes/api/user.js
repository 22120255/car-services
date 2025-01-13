const express = require('express');
const router = express.Router();

const { isAuthenticated } = require('../../middleware/authMiddleware');
const userController = require('../../controllers/UserController');
const { checkRole } = require('../../middleware/authMiddleware');
const { uploadAvatar, uploadProductImage, uploadReviewImage } = require('../../config/multer');
const productController = require('../../controllers/ProductController');
const cacheMiddleware = require('../../middleware/cacheMiddleware');

router.patch('/update-role', checkRole(['admin', 'sadmin']), userController.updateRole);
router.patch('/update-status', checkRole(['admin', 'sadmin']), userController.updateStatus);
router.patch('/avatar/store', uploadAvatar.single('avatar'), userController.updateAvatar);
router.delete('/:id', checkRole(['admin', 'sadmin']), userController.deleteUser);
router.get('/', checkRole(['admin', 'sadmin']), userController.getUsers);
router.post('/product/store', uploadProductImage.single('image'), userController.storeProduct);
router.patch('/', isAuthenticated, userController.updateProfile);

// user
router.post('/review/store', uploadReviewImage.single('review'), userController.storeReview);

// inventory
router.get('/inventory/:id', checkRole(['admin', 'sadmin']), userController.getProduct);
router.post('/inventory/create-product', checkRole(['admin', 'sadmin']), userController.createProduct);
router.put('/inventory/update-product/:id', checkRole(['admin', 'sadmin']), userController.updateProduct);
router.delete('/inventory/delete-product/:id', checkRole(['admin', 'sadmin']), userController.deleteProduct);
router.get('/inventory', checkRole(['admin', 'sadmin']), productController.getProducts);

// trash
router.delete('/trash/delete/:id', checkRole(['admin', 'sadmin']), userController.forceDeleteProduct);
router.patch('/trash/restore/:id', checkRole(['admin', 'sadmin']), userController.restoreProduct);
router.get('/trash', checkRole(['admin', 'sadmin']), userController.trashAndGetProducts);

// order
router.get('/orders', checkRole(['admin', 'sadmin']), userController.getOrders);
router.get('/orders/:id', checkRole(['admin', 'sadmin']), userController.getOrder);
router.patch('/orders/update-status/:id', checkRole(['admin', 'sadmin']), userController.updateOrderStatus);

module.exports = router;
