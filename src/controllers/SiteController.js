const User = require('../models/User')
const cloudinary = require('../config/cloudinary')
const logger = require('../config/logger')
class SiteController {
    // [GET] /
    index(req, res) {
        res.redirect('/dashboard')
    }
}

module.exports = new SiteController()
