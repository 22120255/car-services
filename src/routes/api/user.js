const express = require('express')
const router = express.Router()

const { isAuthenticated } = require('../../middleware/authMiddleware')
const userController = require('../../controllers/UserController')
const { checkRole } = require('../../middleware/authMiddleware')
const { uploadImage } = require('../../config/multer')

router.patch('/update-role', isAuthenticated, checkRole(['admin', 'sadmin']), userController.updateRole)
router.patch('/update-status', isAuthenticated, checkRole(['admin', 'sadmin']), userController.updateStatus)
router.patch('/avatar/store', isAuthenticated, uploadImage.single('avatar'), userController.updateAvatar)
router.delete('/:id', isAuthenticated, checkRole(['admin', 'sadmin']), userController.deleteUser)
router.get('/', isAuthenticated, checkRole(['admin', 'sadmin']), userController.getUsers)

router.patch("/", isAuthenticated, userController.updateProfile)


module.exports = router
