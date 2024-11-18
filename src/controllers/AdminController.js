const User = require('../models/User');
const Role = require('../models/Role');
const logger = require('../config/logger');
class AdminController {
    // [GET] /admin/users/accounts
    async accounts(req, res) {
        try {
            const users = await User.find({})
                .select('+password')

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
            const targetUser = await User.findById(userId);

            if (targetUser.role === 'sadmin') {
                return res.status(403).json({ error: 'Không thể cập nhật vai trò của super admin' });
            }

            if (targetUser.role === 'admin' && !req.user.role.permissions.includes('manage_admins')) {
                return res.status(403).json({ error: 'Admin không thể cập nhật vai trò của admin khác' });
            }

            await User.findByIdAndUpdate(userId, { role });
            return res.status(200).json({ message: 'Cập nhật vai trò thành công' });
        } catch (error) {
            logger.error(error.message);
            res.status(500).json({ error: "Có lỗi, vui lòng thử lại sau" });
        }
    }

    // [PATCH] /admin/users/update-status
    async updateStatus(req, res) {
        try {
            const { userId, status } = req.body;
            const targetUser = await User.findById(userId);

            // Kiểm tra quyền thay đổi status
            if (targetUser.role === 'sadmin') {
                return res.status(403).json({ error: 'Không thể thay đổi trạng thái của super admin' });
            }

            if (targetUser.role === 'admin' && !req.user.role.permissions.includes('manage_admins')) {
                return res.status(403).json({ error: 'Admin không thể thay đổi trạng thái của admin khác' });
            }

            await User.findByIdAndUpdate(userId, { status });
            return res.status(200).json({ message: 'Cập nhật trạng thái thành công' });
        } catch (error) {
            logger.error(error.message);
            res.status(500).json({ error: "Có lỗi, vui lòng thử lại sau!" });
        }
    }

    // [DELETE] /admin/users/:id
    async deleteUser(req, res) {
        try {
            const { id } = req.params;
            const targetUser = await User.findById(id);

            // Kiểm tra quyền xóa
            if (targetUser.role === 'sadmin') {
                return res.status(403).json({ error: 'Không thể xoá tài khoản super admin' });
            }

            if (targetUser.role === 'admin' && !req.user.role.permissions.includes('manage_admins')) {
                return res.status(403).json({ error: 'Admin không thể xoá tài khoản của admin khác' });
            }

            // await User.findByIdAndDelete(id);
            res.status(200).json({ message: 'Xóa tài khoản thành công' });
        } catch (error) {
            logger.error(error.message);
            res.status(500).json({ error: "Có lỗi, vui lòng thử lại sau!" });
        }
    }

    // [GET] /admin/users/:id/details
    async getUserDetails(req, res) {
        try {
            const user = await User.findById(req.params.id).populate({
                path: 'metadata.purchasedProducts',
                model: 'Product'
            });

            res.render('admin/users/detail', { user, layout: false });
        } catch (error) {
            logger.error(error.message);
            res.status(500).json({ error: "Có lỗi, vui lòng thử lại sau!" });
        }
    }
}

module.exports = new AdminController();