const express = require('express')
const router = express.Router()

const adminController = require('../controllers/AdminController')
const { checkRole } = require('../middleware/authMiddleware')

router.get('/users/accounts', checkRole(['admin', 'sadmin']), adminController.accounts)
router.patch('/users/update-role', checkRole(['admin', 'sadmin']), adminController.updateRole)
router.patch('/users/update-status', checkRole(['admin', 'sadmin']), adminController.updateStatus)
router.delete('/users/:id', checkRole(['admin', 'sadmin']), adminController.deleteUser)
router.get('/users/:id/details', checkRole(['admin', 'sadmin']), adminController.getUserDetails)

module.exports = router
