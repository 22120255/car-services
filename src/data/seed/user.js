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
    ...Array.from({ length: 29 }, (_, i) => ({
        fullName: `User ${i + 1}`,
        email: `user${i + 1}@example.com`,
        password: 'user123',
        role: i % 3 === 0 ? 'sadmin' : i % 3 === 1 ? 'admin' : 'user',
        status: i % 2 === 0 ? 'active' : 'inactive',
        avatar: '/images/avatar-default.jpg',
        verificationCode: i % 2 === 0 ? null : `code${i}`,
        lastLogin: new Date(),
        metadata: i % 2 === 0
            ? {
                phone: `090${Math.floor(Math.random() * 9000000) + 1000000}`,
                address: `City ${i + 1}`,
                purchasedProducts: null,
                recentActivity: [
                    {
                        type: i % 3 === 0 ? 'purchase' : 'search',
                        date: new Date(),
                        description: i % 3 === 0
                            ? `Purchased car ${i}`
                            : `Browsed listings for item ${i}`
                    }
                ]
            }
            : null,
        adminStats: i % 3 === 0
            ? {
                totalCars: Math.floor(Math.random() * 20) + 1,
                soldCars: Math.floor(Math.random() * 10) + 1,
                monthlyRevenue: Math.floor(Math.random() * 100000000) + 10000000,
                popularBrand: i % 2 === 0 ? 'Toyota' : 'Honda',
                avgSalePrice: Math.floor(Math.random() * 50000000) + 10000000,
                satisfaction: (Math.random() * 2 + 3).toFixed(1)
            }
            : null
    }))
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