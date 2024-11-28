const express = require('express')
const router = express.Router()

const userController = require('../../controllers/UserController')
const adminController = require('../../controllers/AdminController')
const { checkRole } = require('../../middleware/authMiddleware')
const { uploadImage } = require('../../config/multer')
router.patch('/update-role', checkRole(['admin', 'sadmin']), adminController.updateRole)
router.patch('/update-status', checkRole(['admin', 'sadmin']), adminController.updateStatus)
router.patch('/avatar/store', uploadImage.single('avatar'), userController.updateAvatar)
router.delete('/:id', checkRole(['admin', 'sadmin']), adminController.deleteUser)
router.get('/', checkRole(['admin', 'sadmin']), adminController.getUser)
router.patch("/", userController.updateProfile)

module.exports = router
