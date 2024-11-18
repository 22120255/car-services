const User = require('../models/User');
const logger = require('../config/logger');

class AdminService {
    async getUsers() {
        return await User.find({}).select('+password');
    }

    async updateUserRole(userId, role, currentUser) {
        const targetUser = await User.findById(userId);

        if (targetUser.role === 'sadmin') {
            throw new Error('Không thể cập nhật vai trò của super admin');
        }

        if (targetUser.role === 'admin' && !currentUser.role.permissions.includes('manage_admins')) {
            throw new Error('Admin không thể cập nhật vai trò của admin khác');
        }

        await User.findByIdAndUpdate(userId, { role });
    }

    async updateUserStatus(userId, status, currentUser) {
        const targetUser = await User.findById(userId);

        if (targetUser.role === 'sadmin') {
            throw new Error('Không thể thay đổi trạng thái của super admin');
        }

        if (targetUser.role === 'admin' && !currentUser.role.permissions.includes('manage_admins')) {
            throw new Error('Admin không thể thay đổi trạng thái của admin khác');
        }

        await User.findByIdAndUpdate(userId, { status });
    }

    async deleteUser(userId, currentUser) {
        const targetUser = await User.findById(userId);

        if (targetUser.role === 'sadmin') {
            throw new Error('Không thể xoá tài khoản super admin');
        }

        if (targetUser.role === 'admin' && !currentUser.role.permissions.includes('manage_admins')) {
            throw new Error('Admin không thể xoá tài khoản của admin khác');
        }

        await User.findByIdAndDelete(userId);
    }

    async getUserDetails(userId) {
        return await User.findById(userId).populate({
            path: 'metadata.purchasedProducts',
            model: 'Product'
        });
    }
}

module.exports = new AdminService();
