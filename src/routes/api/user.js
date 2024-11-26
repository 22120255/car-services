const express = require('express')
const router = express.Router()

const userController = require('../../controllers/UserController')

router.patch("/", userController.updateProfile)

module.exports = router
