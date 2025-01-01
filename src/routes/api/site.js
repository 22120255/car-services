const express = require('express')
const router = express.Router()

const siteController = require('../../controllers/SiteController')
const { checkRole } = require('../../middleware/authMiddleware');
const cacheMiddleware = require('../../middleware/cacheMiddleware');

router.get("/logs/error", checkRole(['admin', 'sadmin']), siteController.logsError)
router.get("/logs/info", checkRole(['admin', 'sadmin']), siteController.logsInfo)
router.get('/data/analytics', checkRole(['admin', 'sadmin']), siteController.getAnalytics);

module.exports = router