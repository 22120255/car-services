const User = require("../models/User")
const cloudinary = require('../config/cloudinary');
const logger = require("../config/logger");
class SiteController {
    // [GET] /
    index(req, res) {
        res.redirect("/dashboard")
    }

    // [GET] /profile/:id
    async profile(req, res) {
        const userId = req.params.id;
        const user = await User.findById(userId);
        res.render("site/profile", {
            _user: user,
            title: 'Thông tin cá nhân'
        })
    }
}

module.exports = new SiteController()