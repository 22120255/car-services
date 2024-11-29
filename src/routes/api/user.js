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
router.get('/inventory/:id', checkRole(['admin', 'sadmin']), userController.getProduct);
router.post('/inventory/create-product', checkRole(['admin', 'sadmin']), userController.createProduct);
router.put('/inventory/update-product/:id', checkRole(['admin', 'sadmin']), userController.updateProduct);
router.get('/inventory', checkRole(['admin', 'sadmin']), productController.productsAndGetProducts);

module.exports = router;
