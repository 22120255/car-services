const express = require('express')
const router = express.Router()

const siteController = require('../../controllers/SiteController')
const { isAuthenticated } = require('../../middleware/authMiddleware')
const cacheMiddleware = require('../../middleware/cacheMiddleware')

router.get('/profile/:id', isAuthenticated, cacheMiddleware, siteController.profile)
router.get('/', cacheMiddleware, siteController.index)

module.exports = router