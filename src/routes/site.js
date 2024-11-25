const express = require('express')
const router = express.Router()

const siteController = require('../controllers/SiteController')
const { isAuthenticated } = require('../middleware/authMiddleware')
const { uploadImage } = require('../config/multer')
const cacheMiddleware = require('../middleware/cacheMiddleware')

router.get('/profile/:id', isAuthenticated, cacheMiddleware, siteController.profile)
router.patch('/user/avatar/store', uploadImage.single('avatar'), siteController.updateAvatar)
router.get('/', cacheMiddleware, siteController.index)

module.exports = router