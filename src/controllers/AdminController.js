const User = require('../models/User');
const Role = require('../models/Role');
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
            res.status(500).json({ success: false, error: error.message });
        }
    }

    // [PATCH] /admin/users/update-role
    async updateRole(req, res) {
        try {
            const { userId, role } = req.body;

            if (req.user.role.permissions.includes('manage_admins')) {
                await User.findByIdAndUpdate(userId, { role });
                return res.status(200).json({ message: 'Cập nhật vai trò thành công' });
            } else {
                return res.status(403).json({
                    error: 'Không có quyền cập nhật vai trò'
                });
            }
        } catch (error) {
            console.log("error: ", error)
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
            console.log("error: ", error)
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
            console.log("error: ", error)
            res.status(500).json({ error: "Có lỗi, vui lòng thử lại sau!" });
        }
    }

    // [GET] /admin/users/:id/details
    async getUserDetails(req, res) {
        try {
            const user = await User.findById(req.params.id);
            res.render('admin/partials/user-details', { user, layout: false });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }
}

module.exports = new AdminController();