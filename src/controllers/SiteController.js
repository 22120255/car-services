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
        res.render("site/profile", { _user: user })
    }

    // [PATCH] /user/avatar/store
    async updateAvatar(req, res) {
        try {
            const pathFile = req.file.path;
            const userId = req.body.userId;

            await User.findByIdAndUpdate(userId, {
                avatar: pathFile
            });

            res.status(200).json({
                avatarUrl: pathFile
            });

        } catch (error) {
            logger.error(error.message);
            res.status(500).json({
                error: 'Failed to update avatar'
            });
        }
    }
}

module.exports = new SiteController()