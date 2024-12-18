const express = require('express');
const router = express.Router();

const cacheMiddleware = require('../../middleware/cacheMiddleware');
const { isAuthenticated } = require('../../middleware/authMiddleware');
const userController = require('../../controllers/UserController');
const { checkRole } = require('../../middleware/authMiddleware');

router.get('/profile/:id', isAuthenticated, cacheMiddleware, userController.profile);
router.get('/purchased-list', isAuthenticated, userController.getPurchasedList);
router.get('/:id', checkRole(['admin', 'sadmin']), userController.getUser); // render view user detail

module.exports = router;
