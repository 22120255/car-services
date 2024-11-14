const express = require('express')
const router = express.Router()

const siteController = require('../controllers/SiteController')
const { isAuthenticated } = require('../middleware/authMiddleware')
const { uploadImage } = require('../config/multer')

router.get('/profile/:id', isAuthenticated, siteController.profile)
router.patch('/user/avatar/store', uploadImage.single('avatar'), siteController.updateAvatar)
router.get('/', siteController.index)

module.exports = router