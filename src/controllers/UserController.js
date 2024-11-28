const UserService = require('../services/UserService')
const { clearCache } = require('../utils/helperCache')
const { errorLog } = require("../utils/customLog")


class UserController {
    // [PATCH] /api/user
    async updateProfile(req, res) {
        try {
            const { id } = req.body;
            const user = await UserService.updateProfile(id, req.body)
            clearCache(`/profile/${id}`)
            res.status(200).json(user)
        } catch (error) {
            errorLog("UserController", 15, error.message)
            res.status(500).json({ message: error.message })
        }
    }

    // [PATCH] /user/avatar/store
    async updateAvatar(req, res) {
        try {
            const pathFile = req.file.path;
            const userId = req.body.userId;

            const result = await UserService.updateAvatar(userId, pathFile);
            res.status(200).json(result);
        } catch (error) {
            errorLog("UserController", 29, error.message);
            res.status(500).json({
                error: 'Failed to update avatar'
            });
        }
    }
}

module.exports = new UserController()
