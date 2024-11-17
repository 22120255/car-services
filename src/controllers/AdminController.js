const User = require('../models/User');

class AdminController {
    // [GET] /admin/users/accounts
    async accounts(req, res) {
        try {
            const users = await User.find({}).select('+password');
            const usersWithFlags = users.map(user => ({
                ...user.toObject(),
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

            if (userId === req.user._id.toString()) {
                return res.status(403).json({
                    success: false,
                    error: 'Cannot change your own role'
                });
            }

            await User.findByIdAndUpdate(userId, { role });
            res.json({ success: true });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }

    // [PATCH] /admin/users/update-status
    async updateStatus(req, res) {
        try {
            const { userId, status } = req.body;

            if (userId === req.user._id.toString()) {
                return res.status(403).json({
                    success: false,
                    error: 'Cannot change your own status'
                });
            }

            await User.findByIdAndUpdate(userId, { status });
            res.json({ success: true });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }

    // [DELETE] /admin/users/:id
    async deleteUser(req, res) {
        try {
            const { id } = req.params;

            if (id === req.user._id.toString()) {
                return res.status(403).json({
                    success: false,
                    error: 'Cannot delete your own account'
                });
            }

            await User.findByIdAndDelete(id);
            res.json({ success: true });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
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