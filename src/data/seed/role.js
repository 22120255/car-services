const mongoose = require('mongoose');
const Role = require('../../models/Roles');
require('dotenv').config();

const roles = [
    {
        _id: 1,
        name: 'sadmin',
        description: 'Super Administrator - Có toàn quyền quản lý hệ thống',
        permissions: [
            'view_users',
            'edit_users',
            'delete_users',
            'disable_users',
            'manage_admins',
            'manage_cars',
            'view_stats',
            'manage_system',
            'view_own_profile',
            'edit_own_profile'
        ],
        isActive: true
    },
    {
        _id: 2,
        name: 'admin',
        description: 'Administrator - Quản lý người dùng và nội dung',
        permissions: [
            'view_users',
            'edit_users',
            'disable_users',
            'manage_cars',
            'view_stats',
            'manage_system',
            'view_own_profile',
            'edit_own_profile'
        ],
        isActive: true
    },
    {
        _id: 3,
        name: 'user',
        description: 'Người dùng thông thường',
        permissions: [
            'view_own_profile',
            'edit_own_profile'
        ],
        isActive: true
    }
];

const seedRoles = async () => {
    try {
        // Kết nối database
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        // Xóa tất cả roles cũ (nếu có)
        await Role.deleteMany({});
        console.log('Deleted existing roles');

        // Reset counter collection
        await mongoose.connection.db.collection('counters').deleteOne({ _id: 'roles' });

        // Thêm roles mới với _id được chỉ định
        const createdRoles = await Role.insertMany(roles);
        console.log('Created new roles:', createdRoles);

        console.log('Role seeding completed successfully');
    } catch (error) {
        console.error('Error seeding roles:', error);
    } finally {
        // Đóng kết nối
        await mongoose.connection.close();
        console.log('Disconnected from MongoDB');
    }
};

// Chạy seeder
seedRoles();