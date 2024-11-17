const express = require('express')
const router = express.Router()

const adminController = require('../controllers/AdminController')
const { checkRole } = require('../middleware/authMiddleware')

router.get('/users/accounts', checkRole(['admin', 'sadmin']), adminController.accounts)
router.patch('/users/update-role', checkRole(['admin', 'sadmin']), adminController.updateRole)
router.patch('/users/update-status', checkRole(['admin', 'sadmin']), adminController.updateStatus)
router.delete('/users/delete', checkRole(['admin', 'sadmin']), adminController.deleteUser)
router.patch('/users/update-password', checkRole(['admin', 'sadmin']), adminController.updatePassword)

module.exports = router
