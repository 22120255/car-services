const mongoose = require('mongoose');
const Order = require('../../models/Order');
const User = require('../../models/User');
const Product = require('../../models/Product');
require('dotenv').config({ path: process.env.NODE_ENV === 'development' ? `.env.dev` : '.env' });

function getRandomDate(fromYear, toYear) {
    const start = new Date(`${fromYear}-01-01T00:00:00`);
    const end = new Date(`${toYear}-12-31T23:59:59`);
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

async function createMockData(num) {
    try {
        // Kết nối MongoDB
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log('Connected to database');

        // Lấy danh sách userId
        const users = await User.find({}, '_id');
        const userIds = users.map(user => user._id);

        // Lấy danh sách productId
        const products = await Product.find({}, '_id price');
        const productList = products.map(product => ({
            productId: product._id,
            price: product.price,
        }));

        if (userIds.length === 0 || productList.length === 0) {
            console.log('No users or products found');
            return;
        }

        // Tạo mock data cho orders
        for (let i = 0; i < num; i++) {
            const randomUserId = userIds[Math.floor(Math.random() * userIds.length)];
            const randomProducts = Array.from({ length: Math.floor(Math.random() * 3) + 1 }).map(() => {
                const product = productList[Math.floor(Math.random() * productList.length)];
                return {
                    productId: product.productId,
                    quantity: Math.floor(Math.random() * 5) + 1,
                    price: product.price,
                };
            });

            const totalAmount = randomProducts.reduce((acc, item) => acc + item.price * item.quantity, 0);
            const fakeCreatedAt = getRandomDate(2024, 2025);

            const order = new Order({
                userId: randomUserId,
                items: randomProducts,
                totalAmount: totalAmount,
                shippingDetails: `Address ${i + 1}`,
                status: 'completed',
                createdAt: fakeCreatedAt,
            });

            await order.save();
            console.log(`Order ${i + 1} created`);
        }

        console.log('Mock data created successfully');
    } catch (error) {
        console.error('Error creating mock data:', error);
    } finally {
        mongoose.connection.close();
    }
}

createMockData(1000);
