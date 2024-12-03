const express = require('express')
const router = express.Router()

const siteController = require('../../controllers/SiteController')
const cacheMiddleware = require('../../middleware/cacheMiddleware')

router.get('/settings', cacheMiddleware, siteController.settings)
router.get('/', cacheMiddleware, siteController.index)

module.exports = router