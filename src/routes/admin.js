const express = require('express')
const router = express.Router()

const adminController = require('../controllers/AdminController')
const { checkRole } = require('../middleware/authMiddleware')

router.get('/accounts', checkRole('admin'), adminController.accounts)

module.exports = router
