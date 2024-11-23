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
        role: {
            name: 'sadmin',
            description: 'Super Administrator'
        },
        status: 'active',
        avatar: '/images/avatar-default.jpg',
        verificationCode: null,
        lastLogin: new Date(),
        metadata: {
            phone: '0123456789',
            address: 'Hà Nội',
            purchasedProducts: [],
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
        role: {
            name: i % 3 === 0 ? 'sadmin' : i % 3 === 1 ? 'admin' : 'user',
            description: i % 3 === 0 ? 'Super Administrator' : i % 3 === 1 ? 'Administrator' : 'Regular User'
        },
        status: i % 2 === 0 ? 'active' : 'inactive',
        avatar: '/images/avatar-default.jpg',
        verificationCode: i % 2 === 0 ? null : `code${i}`,
        lastLogin: new Date(),
        metadata: i % 2 === 0
            ? {
                phone: `090${Math.floor(Math.random() * 9000000) + 1000000}`,
                address: `City ${i + 1}`,
                purchasedProducts: [],
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
            : {
                phone: null,
                address: null,
                purchasedProducts: [],
                recentActivity: []
            },
        adminStats: i % 3 === 0 || i % 3 === 1
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
        // Connect to database
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        // Delete existing users if needed
        await User.deleteMany({});
        console.log('Deleted existing users');

        // Hash passwords and create new users
        const hashedUsers = await Promise.all(users.map(async user => {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(user.password, salt);
            return { ...user, password: hashedPassword };
        }));

        // Insert new users
        const createdUsers = await User.insertMany(hashedUsers);
        console.log(`Created ${createdUsers.length} new users`);

        console.log('User seeding completed successfully');
    } catch (error) {
        console.error('Error seeding users:', error);
    } finally {
        // Close connection
        await mongoose.connection.close();
        console.log('Disconnected from MongoDB');
    }
};

// Run seeder
seedUsers();