const User = require('../models/User')
const cloudinary = require('../config/cloudinary')
const logger = require('../config/logger')
class SiteController {
    // [GET] /
    index(req, res) {
        res.redirect('/dashboard')
    }

    // [GET] /settings
    settings(req, res) {
        res.render("site/settings", {
            title: "Cài đặt"
        })
    }
}

module.exports = new SiteController()
