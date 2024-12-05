const express = require('express');
const router = express.Router();

const { isAuthenticated } = require('../../middleware/authMiddleware');
const userController = require('../../controllers/UserController');
const { checkRole } = require('../../middleware/authMiddleware');
const { uploadImage } = require('../../config/multer');
const productController = require('../../controllers/ProductController');

router.patch('/update-role', isAuthenticated, checkRole(['admin', 'sadmin']), userController.updateRole);
router.patch('/update-status', isAuthenticated, checkRole(['admin', 'sadmin']), userController.updateStatus);
router.patch('/avatar/store', isAuthenticated, uploadImage.single('avatar'), userController.updateAvatar);
router.delete('/:id', isAuthenticated, checkRole(['admin', 'sadmin']), userController.deleteUser);
router.get('/', isAuthenticated, checkRole(['admin', 'sadmin']), userController.getUsers);

router.patch('/', isAuthenticated, userController.updateProfile);

// inventory
router.get('/inventory/:id', isAuthenticated, checkRole(['admin', 'sadmin']), userController.getProduct);
router.post('/inventory/create-product', isAuthenticated, checkRole(['admin', 'sadmin']), userController.createProduct);
router.put('/inventory/update-product/:id', isAuthenticated, checkRole(['admin', 'sadmin']), userController.updateProduct);
router.delete('/inventory/delete-product/:id', isAuthenticated, checkRole(['admin', 'sadmin']), userController.deleteProduct);
router.get('/inventory', isAuthenticated, checkRole(['admin', 'sadmin']), productController.productsAndGetProducts);

// trash
router.delete('/trash/delete/:id', isAuthenticated, checkRole(['admin', 'sadmin']), userController.forceDeleteProduct);
router.patch('/trash/restore/:id', isAuthenticated, checkRole(['admin', 'sadmin']), userController.restoreProduct);
router.get('/trash', isAuthenticated, checkRole(['admin', 'sadmin']), userController.trashAndGetProducts);

module.exports = router;
