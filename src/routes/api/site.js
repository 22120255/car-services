const express = require('express')
const router = express.Router()

const siteController = require('../../controllers/SiteController')
const { checkRole, isAuthenticated } = require('../../middleware/authMiddleware');

router.get("/logs/error", checkRole(['admin', 'sadmin']), siteController.logsError)
router.get("/logs/info", checkRole(['admin', 'sadmin']), siteController.logsInfo)

module.exports = router