const mongoose = require('mongoose');
const dotenv = require('dotenv');
const createMockProducts = require('../data/mockProducts');
const Product = require('../models/Product');


dotenv.config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        // Kiểm tra nếu chưa có products thì tạo mới
        const products = await Product.find();
        if (products.length === 0) {
            const mockProducts = await createMockProducts();  // Tạo dữ liệu mock products
            await Product.insertMany(mockProducts); // Chèn products vào DB
            console.log('Mock products inserted!');
        }

        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};

module.exports = { connectDB };

