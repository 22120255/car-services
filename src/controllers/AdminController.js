const AdminService = require('../services/AdminService')
const logger = require('../config/logger')
const { errorLog } = require('../utils/customLog')
class AdminController {
    // [GET] /admin/dashboard
    index(req, res) {
        res.render('admin/dashboard', { layout: 'admin', title: 'Dashboard' })
    }

    // [GET] /admin/users/accounts
    accounts(req, res) {
        try {
            res.render('admin/users/accounts', {
                layout: 'admin',
                title: 'Quản lý tài khoản',
            })
        } catch (error) {
            logger.error(error.message)
            res.status(500).json({ error: 'Có lỗi, vui lòng thử lại sau' })
        }
    }

    // [GET] /admin/users
    async getUser(req, res) {
        const { limit, offset, key, direction, search, status, role } =
            req.query
        try {
            const { users, total } = await AdminService.getUsers({
                limit: limit || 10,
                offset: offset || 0,
                key,
                direction,
                search,
                status,
                role,
            })
            return res.status(200).json({ data: users, total })
        } catch (error) {
            errorLog('AdminController', 24, error.message)
            res.status(500).json({ error: 'Có lỗi, vui lòng thử lại sau' })
        }
    }

    // [PATCH] /admin/users/update-role
    async updateRole(req, res) {
        try {
            const { userId, role } = req.body
            await AdminService.updateUserRole(userId, role, req.user)
            return res
                .status(200)
                .json({ message: 'Cập nhật vai trò thành công' })
        } catch (error) {
            errorLog('AdminController', 36, error.message)
            return res.status(403).json({ error: error.message })
        }
    }

    // [PATCH] /admin/users/update-status
    async updateStatus(req, res) {
        try {
            const { userId, status } = req.body
            await AdminService.updateUserStatus(userId, status, req.user)
            return res
                .status(200)
                .json({ message: 'Cập nhật trạng thái thành công' })
        } catch (error) {
            logger.error(error.message)
            return res.status(403).json({ error: error.message })
        }
    }

    // [DELETE] /admin/users/:id
    async deleteUser(req, res) {
        try {
            await AdminService.deleteUser(req.params.id, req.user)
            res.status(200).json({ message: 'Xóa tài khoản thành công' })
        } catch (error) {
            logger.error(error.message)
            return res.status(403).json({ error: error.message })
        }
    }

    // [GET] /admin/users/:id/details
    async getUserDetails(req, res) {
        try {
            const user = await AdminService.getUserDetails(req.params.id)
            res.render('admin/users/detail', { user, layout: false })
        } catch (error) {
            logger.error(error.message)
            res.status(500).json({ error: 'Có lỗi, vui lòng thử lại sau!' })
        }
    }

    // [GET] /admin/inventory/products
    async products(req, res) {
        try {
            res.render('admin/inventory/products', {
                layout: 'admin',
                title: 'Quản lý sản phẩm',
            })
        } catch (error) {
            logger.error(error.message)
            res.status(500).json({ error: 'Có lỗi, vui lòng thử lại sau!' })
        }
    }

    // [GET] /admin/inventory/
    async getProducts(req, res) {
        const {
            limit,
            offset,
            search,
            status,
            brand,
            model,
            priceMin,
            priceMax,
        } = req.query
        try {
            const { products, total } = await AdminService.getProducts({
                limit: limit || 10,
                offset: offset || 1,
                search,
                status,
                brand,
                model,
                priceMin,
                priceMax,
            })
            return res.status(200).json({ products, total })
        } catch (error) {
            logger.error(error.message)
            res.status(500).json({ error: 'Có lỗi, vui lòng thử lại sau' })
        }
    }

    // [GET] /admin/orders
    async orders(req, res) {
        try {
            res.render('admin/orders', {
                layout: 'admin',
                title: 'Quản lý đơn hàng',
            })
        } catch (error) {
            logger.error(error.message)
            res.status(500).json({ error: 'Có lỗi, vui lòng thử lại sau!' })
        }
    }

    // [GET] /admin/reports
    async reports(req, res) {
        try {
            res.render('admin/reports', {
                layout: 'admin',
                title: 'Báo cáo thống kê',
            })
        } catch (error) {
            logger.error(error.message)
            res.status(500).json({ error: 'Có lỗi, vui lòng thử lại sau!' })
        }
    }

    // [GET] /admin/settings
    async settings(req, res) {
        try {
            res.render('admin/settings', {
                layout: 'admin',
                title: 'Cài đặt hệ thống',
            })
        } catch (error) {
            logger.error(error.message)
            res.status(500).json({ error: 'Có lỗi, vui lòng thử lại sau!' })
        }
    }
}

module.exports = new AdminController()
