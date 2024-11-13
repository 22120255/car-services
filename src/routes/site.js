const express = require('express')
const router = express.Router()

const siteController = require('../controllers/SiteController')
const { isAuthenticated } = require('../middleware/authMiddleware')

router.get('/profile/:id', isAuthenticated, siteController.profile)
router.get('/', siteController.index)

module.exports = router