const mongoose = require('mongoose');
const User = require('../../models/User');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');

dotenv.config({ path: process.env.NODE_ENV === 'development' ? `.env.dev` : '.env' });

const users = [
    {
        fullName: 'Super Admin',
        email: 'sadmin@example.com',
        password: 'sadmin123',
        role: 'sadmin',
        status: 'active',
        avatar: '/images/avatar-default.jpg',
        verificationCode: null,
        lastLogin: new Date(),
        metadata: {
            phone: '0123456789',
            address: 'Hà Nội',
            purchasedProducts: null,
            recentActivity: [
                {
                    type: 'purchase',
                    date: new Date(),
                    description: 'Purchased Toyota Camry'
                }
            ]
        },
        adminStats: {
            totalCars: 10,
            soldCars: 5,
            monthlyRevenue: 500000000,
            popularBrand: 'Toyota',
            avgSalePrice: 100000000,
            satisfaction: 4.8
        }
    },
    {
        fullName: 'Admin User',
        email: 'admin@example.com',
        password: 'admin123',
        role: 'admin',
        status: 'active',
        avatar: '/images/avatar-default.jpg',
        verificationCode: null,
        lastLogin: new Date(),
        metadata: {
            phone: '0987654321',
            address: 'Hồ Chí Minh',
            purchasedProducts: null,
            recentActivity: [
                {
                    type: 'search',
                    date: new Date(),
                    description: 'Searched for Honda cars'
                }
            ]
        },
        adminStats: {
            totalCars: 8,
            soldCars: 3,
            monthlyRevenue: 300000000,
            popularBrand: 'Honda',
            avgSalePrice: 90000000,
            satisfaction: 4.5
        }
    },
    {
        fullName: 'Normal User',
        email: 'user@example.com',
        password: 'user123',
        role: 'user',
        status: 'active',
        avatar: '/images/avatar-default.jpg',
        verificationCode: null,
        lastLogin: new Date(),
        metadata: {
            phone: '0369852147',
            address: 'Đà Nẵng',
            purchasedProducts: null,
            recentActivity: [
                {
                    type: 'search',
                    date: new Date(),
                    description: 'Browsed car listings'
                }
            ]
        },
        adminStats: null
    }
];

const seedUsers = async () => {
    try {
        // Kết nối database
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        // Xóa tất cả users cũ (nếu có)
        // await User.deleteMany({});
        // console.log('Deleted existing users');

        // Hash passwords và tạo users mới
        const hashedUsers = await Promise.all(users.map(async user => {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(user.password, salt);
            return { ...user, password: hashedPassword };
        }));

        // Thêm users mới
        const createdUsers = await User.insertMany(hashedUsers);
        console.log('Created new users:', createdUsers);

        console.log('User seeding completed successfully');
    } catch (error) {
        console.error('Error seeding users:', error);
    } finally {
        // Đóng kết nối
        await mongoose.connection.close();
        console.log('Disconnected from MongoDB');
    }
};

// Chạy seeder
seedUsers();