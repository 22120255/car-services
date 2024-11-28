const express = require('express')
const router = express.Router()

const cacheMiddleware = require('../../middleware/cacheMiddleware')
const { isAuthenticated } = require('../../middleware/authMiddleware')
const userController = require('../../controllers/UserController')
const { checkRole } = require('../../middleware/authMiddleware')

router.get("/dashboard", checkRole(['admin', 'sadmin']), userController.index) // render view dashboard of admin
router.get('/accounts', checkRole(['admin', 'sadmin']), userController.accounts) // render view user management
router.get('/products', checkRole(['admin', 'sadmin']), userController.products) // render view Inventory
router.get('/orders', checkRole(['admin', 'sadmin']), userController.orders) // render view Orders
router.get('/reports', checkRole(['admin', 'sadmin']), userController.reports) // render view Reports
router.get('/settings', checkRole(['admin', 'sadmin']), userController.settings) // render view Settings
router.get('/profile/:id', isAuthenticated, cacheMiddleware, userController.profile)
router.get('/:id', checkRole(['admin', 'sadmin']), userController.getUser) // render view user detail

module.exports = router
