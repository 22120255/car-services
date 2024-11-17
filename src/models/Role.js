const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const RoleSchema = new mongoose.Schema({
    _id: Number,
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
            'view_users',           // Xem danh sách người dùng
            'edit_users',           // Chỉnh sửa thông tin người dùng
            'delete_users',         // Xóa người dùng
            'disable_users',        // Vô hiệu hóa người dùng
            'manage_admins',        // Quản lý admin (chỉ sadmin)
            'manage_cars',          // Quản lý xe
            'view_stats',           // Xem thống kê
            'manage_system',        // Quản lý hệ thống
            'view_own_profile',     // Xem thông tin cá nhân (user)
            'edit_own_profile'      // Chỉnh sửa thông tin cá nhân (user)
        ]
    }],
    isActive: {
        type: Boolean,
        default: true
    }
}, { timestamps: true, _id: false });

RoleSchema.plugin(AutoIncrement);

module.exports = mongoose.model('Role', RoleSchema, 'roles');
