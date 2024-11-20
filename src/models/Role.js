const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        enum: ['user', 'admin', 'sadmin']
    },
    description: {
        type: String,
        required: true
    },
    permissions: [{
        type: String,
        enum: [
            'manage_users',         // Quản lý người dùng
            'manage_admins',        // Quản lý admin (chỉ sadmin)
            'manage_system',        // Quản lý hệ thống
        ]
    }],
    isActive: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });


module.exports = mongoose.model('Role', roleSchema, 'roles');
