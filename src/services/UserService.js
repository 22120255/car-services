const User = require('../models/User');
const Product = require('../models/Product');

class UserService {
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

        await User.findByIdAndDelete(userId);
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

    // Cập nhật thông tin profile
    async updateProfile(id, data) {
        const updateData = {
            fullName: data.fullName,
            email: data.email,
            'metadata.phone': data.phone,
            'metadata.address': data.address
        }

        const user = await User.findByIdAndUpdate(
            id,
            updateData,
            { new: true }
        )
        return user
    }

    // Cập nhật avatar
    async updateAvatar(userId, pathFile) {
        const user = await User.findByIdAndUpdate(
            userId,
            { avatar: pathFile },
            { new: true }
        );

        if (!user) {
            throw new Error('User not found');
        }

        return {
            avatarUrl: pathFile
        };
    }

    async getProducts({
        limit,
        offset,
        search,
        status,
        brand,
        model,
        priceMin,
        priceMax,
    }) {
        try {
            let filter = {}
            if (search) {
                filter.$or = [
                    { brand: { $regex: search, $options: 'i' } }, // Không phân biệt hoa thường
                    { model: { $regex: search, $options: 'i' } }, // Không phân biệt hoa thường
                ]
            }
            if (status) {
                filter.status = status
            }
            if (brand) {
                filter.brand = { $regex: `^${brand}$`, $options: 'i' } // Tìm chính xác nhưng không phân biệt hoa thường
            }
            if (priceMin && priceMax) {
                filter.price = { $gte: priceMin, $lte: priceMax }
            }

            const products = await Product.find(filter)
                .skip(offset * limit - limit)
                .limit(limit)
            const total = await Product.countDocuments(filter)

            return { products, total }
        } catch (error) {
            throw error
        }
    }
}

module.exports = new UserService()  
