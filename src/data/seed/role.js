const mongoose = require('mongoose');
const Role = require('../../models/Role');
const dotenv = require('dotenv');

dotenv.config({ path: process.env.NODE_ENV === 'development' ? `.env.dev` : '.env' });

const roles = [
    {
        name: 'sadmin',
        description: 'Super Administrator - Có toàn quyền quản lý hệ thống',
        permissions: [
            'manage_users',
            'manage_admins',
            'manage_system'
        ],
        isActive: true
    },
    {
        name: 'admin',
        description: 'Administrator - Quản lý người dùng và nội dung',
        permissions: [
            'manage_users',
            'manage_system'
        ],
        isActive: true
    },
    {
        name: 'user',
        description: 'Người dùng thông thường',
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