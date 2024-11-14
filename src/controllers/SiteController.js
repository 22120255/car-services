const User = require("../models/User")
const cloudinary = require('../config/cloudinary')
class SiteController {
    // [GET] /
    index(req, res) {
        res.redirect("/dashboard")
    }

    // [GET] /profile/:id
    async profile(req, res) {
        const user = await User.findById(req.params.id)
        res.render("site/profile", {
            user
        })
    }

    // [POST] /user/avatar/store
    async updateAvatar(req, res) {
        try {
            const pathFile = req.file.path;
            const userId = req.body.userId;

            await User.findByIdAndUpdate(userId, {
                avatar: pathFile
            });

            res.status(200).json({
                success: true,
                avatarUrl: pathFile
            });

        } catch (error) {
            console.error('Error updating avatar:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to update avatar'
            });
        }
    }
}

module.exports = new SiteController()