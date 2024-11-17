const AdminService = require('../services/AdminService');
const logger = require('../config/logger');

class AdminController {
    // [GET] /admin/users/accounts
    async accounts(req, res) {
        try {
            const users = await AdminService.getUsers();
            const usersWithFlags = users.map(user => ({
                ...user.toObject(),
                role: user.role,
                isCurrentUser: user._id.toString() === req.user._id.toString()
            }));

            res.render('admin/users/accounts', {
                users: usersWithFlags,
                layout: 'admin'
            });
        } catch (error) {
            logger.error(error.message);
            res.status(500).json({ error: "Có lỗi, vui lòng thử lại sau" });
        }
    }

    // [PATCH] /admin/users/update-role
    async updateRole(req, res) {
        try {
            const { userId, role } = req.body;
            await AdminService.updateUserRole(userId, role, req.user);
            return res.status(200).json({ message: 'Cập nhật vai trò thành công' });
        } catch (error) {
            logger.error(error.message);
            return res.status(403).json({ error: error.message });
        }
    }

    // [PATCH] /admin/users/update-status
    async updateStatus(req, res) {
        try {
            const { userId, status } = req.body;
            await AdminService.updateUserStatus(userId, status, req.user);
            return res.status(200).json({ message: 'Cập nhật trạng thái thành công' });
        } catch (error) {
            logger.error(error.message);
            return res.status(403).json({ error: error.message });
        }
    }

    // [DELETE] /admin/users/:id
    async deleteUser(req, res) {
        try {
            await AdminService.deleteUser(req.params.id, req.user);
            res.status(200).json({ message: 'Xóa tài khoản thành công' });
        } catch (error) {
            logger.error(error.message);
            return res.status(403).json({ error: error.message });
        }
    }

    // [GET] /admin/users/:id/details
    async getUserDetails(req, res) {
        try {
            const user = await AdminService.getUserDetails(req.params.id);
            res.render('admin/users/detail', { user, layout: false });
        } catch (error) {
            logger.error(error.message);
            res.status(500).json({ error: "Có lỗi, vui lòng thử lại sau!" });
        }
    }
}

module.exports = new AdminController();