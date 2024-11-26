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
}

module.exports = new UserController()
