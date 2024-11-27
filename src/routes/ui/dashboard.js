const express = require('express')
const router = express.Router()
const cacheMiddleware = require('../../middleware/cacheMiddleware')

const dashboardController = require('../../controllers/DashboardController')

router.get('/contact', cacheMiddleware, dashboardController.contact)
router.get('/about', cacheMiddleware, dashboardController.about)
router.get('/', cacheMiddleware, dashboardController.index)

module.exports = router;
