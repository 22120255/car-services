const User = require('../models/User');
const logger = require('../config/logger');

class AdminService {
    async getUsers({ limit, offset, key, direction, search, status, role }) {
        try {
            let filter = {};
            if (search) {
                filter.$or = [
                    { fullName: { $regex: search, $options: 'i' } },
                    { email: { $regex: search, $options: 'i' } }
                ];
            }
            if (status) {
                filter.status = status;
            }
            if (role) {
                filter['role.name'] = role;
            }
            let sort = {};
            if (key) {
                direction ||= 'asc';
                const sortDirection = direction === 'asc' ? 1 : -1;
                sort[key] = sortDirection;
            }
            const users = await User.find(filter).skip(offset * limit).limit(limit).sort(sort);
            const total = await User.countDocuments(filter);

            return { users, total };
        } catch (error) {
            throw error;
        }
    }

    async updateUserRole(userId, role, currentUser) {
        const targetUser = await User.findById(userId);

        if (targetUser.role.name === 'sadmin') {
            throw new Error('Không thể cập nhật vai trò của super admin');
        }

        if (targetUser.role.name === 'admin' && !currentUser.role.permissions.includes('manage_admins')) {
            throw new Error('Admin không thể cập nhật vai trò của admin khác');
        }

        await User.findByIdAndUpdate(userId, { role });
    }

    async updateUserStatus(userId, status, currentUser) {
        const targetUser = await User.findById(userId);

        if (targetUser.role.name === 'sadmin') {
            throw new Error('Không thể thay đổi trạng thái của super admin');
        }

        if (targetUser.role.name === 'admin' && !currentUser.role.permissions.includes('manage_admins')) {
            throw new Error('Admin không thể thay đổi trạng thái của admin khác');
        }

        await User.findByIdAndUpdate(userId, { status });
    }

    async deleteUser(userId, currentUser) {
        const targetUser = await User.findById(userId);
        console.log("targetUser ", userId);
        if (targetUser.role.name === 'sadmin') {
            throw new Error('Không thể xoá tài khoản super admin');
        }

        if (targetUser.role.name === 'admin' && !currentUser.role.permissions.includes('manage_admins')) {
            throw new Error('Admin không thể xoá tài khoản của admin khác');
        }

        // await User.findByIdAndDelete(userId);
    }

    // Lấy thông tin user
    async getUser(userId) {
        const user = await User.findById(userId).populate({
            path: 'metadata.purchasedProducts',
            model: 'Product'
        });

        if (!user) {
            throw new Error('User not found');
        }

        return user;
    }
}
module.exports = new AdminService();
