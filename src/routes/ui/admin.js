const express = require('express')
const router = express.Router()

const adminController = require('../../controllers/AdminController')
const { checkRole } = require('../../middleware/authMiddleware')

router.get("/dashboard", checkRole(['admin', 'sadmin']), adminController.index) // render view dashbaord
router.get('/users/accounts', checkRole(['admin', 'sadmin']), adminController.accounts) // render view user management
router.get('/users/:id/details', checkRole(['admin', 'sadmin']), adminController.getUserDetails) // render view user detail
router.get('/products', checkRole(['admin', 'sadmin']), adminController.products) // render view Inventory
router.get('/orders', checkRole(['admin', 'sadmin']), adminController.orders) // render view Orders
router.get('/reports', checkRole(['admin', 'sadmin']), adminController.reports) // render view Reports
router.get('/settings', checkRole(['admin', 'sadmin']), adminController.settings) // render view Settings

module.exports = router
