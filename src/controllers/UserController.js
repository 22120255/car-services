const UserService = require('../services/UserService')
const { clearCache } = require('../utils/helperCache')
class UserController {
    // [PATCH] /api/user
    async updateProfile(req, res) {
        try {
            const { id } = req.body;
            const user = await UserService.updateProfile(id, req.body)
            clearCache(`/profile/${id}`)
            res.status(200).json(user)
        } catch (error) {
            res.status(500).json({ message: error.message })
        }
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

module.exports = new UserController()
