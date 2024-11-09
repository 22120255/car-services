const express = require('express')
const router = express.Router()

// const adminController = require('../controllers/AdminController')

router.get('/accounts', (req, res) => {
    res.render('admin/accounts')
})

module.exports = router
