const User = require('../models/User')
const logger = require('../config/logger')
const Product = require('../models/Product')

class AdminService {
    async getUsers({ limit, offset, key, direction, search, status, role }) {
        try {
            let filter = {}
            if (search) {
                filter.$or = [
                    { fullName: { $regex: search, $options: 'i' } },
                    { email: { $regex: search, $options: 'i' } },
                ]
            }
            if (status) {
                filter.status = status
            }
            if (role) {
                filter.role = role
            }
            let sort = {}
            if (key) {
                direction ||= 'asc'
                const sortDirection = direction === 'asc' ? 1 : -1
                sort[key] = sortDirection
            }
            const users = await User.find(filter)
                .skip(offset * limit)
                .limit(limit)
                .sort(sort)
            const total = await User.countDocuments(filter)

            return { users, total }
        } catch (error) {
            throw error
        }
    }

    async updateUserRole(userId, role, currentUser) {
        const targetUser = await User.findById(userId)

        if (targetUser.role === 'sadmin') {
            throw new Error('Không thể cập nhật vai trò của super admin')
        }

        if (
            targetUser.role === 'admin' &&
            !currentUser.role.permissions.includes('manage_admins')
        ) {
            throw new Error('Admin không thể cập nhật vai trò của admin khác')
        }

        await User.findByIdAndUpdate(userId, { role })
    }

    async updateUserStatus(userId, status, currentUser) {
        const targetUser = await User.findById(userId)

        if (targetUser.role === 'sadmin') {
            throw new Error('Không thể thay đổi trạng thái của super admin')
        }

        if (
            targetUser.role === 'admin' &&
            !currentUser.role.permissions.includes('manage_admins')
        ) {
            throw new Error(
                'Admin không thể thay đổi trạng thái của admin khác'
            )
        }

        await User.findByIdAndUpdate(userId, { status })
    }

    async deleteUser(userId, currentUser) {
        const targetUser = await User.findById(userId)

        if (targetUser.role === 'sadmin') {
            throw new Error('Không thể xoá tài khoản super admin')
        }

        if (
            targetUser.role === 'admin' &&
            !currentUser.role.permissions.includes('manage_admins')
        ) {
            throw new Error('Admin không thể xoá tài khoản của admin khác')
        }

        await User.findByIdAndDelete(userId)
    }

    async getUserDetails(userId) {
        return await User.findById(userId).populate({
            path: 'metadata.purchasedProducts',
            model: 'Product',
        })
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

module.exports = new AdminService()
