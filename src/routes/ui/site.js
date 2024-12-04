const express = require('express')
const router = express.Router()

const siteController = require('../../controllers/SiteController')
const { checkRole } = require('../../middleware/authMiddleware');
const cacheMiddleware = require('../../middleware/cacheMiddleware')

router.get('/settings', cacheMiddleware, siteController.settings)
router.get("/logs", checkRole(['admin', 'sadmin']), siteController.logs)
router.get('/', cacheMiddleware, siteController.index)

module.exports = router