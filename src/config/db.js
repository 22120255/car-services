const mongoose = require('mongoose');
const { generateMockProducts } = require('../data/mockProducts');
const Product = require('../models/Product');
var MongoDBStore = require('connect-mongodb-session');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    // // Kiểm tra nếu chưa có products thì tạo mới
    // const products = await Product.find();
    // if (products.length === 0) {
    //   const mockProducts = await generateMockProducts(40); // Tạo dữ liệu mock products
    //   await Product.insertMany(mockProducts); // Chèn products vào DB
    //   console.log('Mock products inserted!');
    // }

    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};
function createSessionStore(session) {
  const mongoStore = MongoDBStore(session);
  const store = new mongoStore(
    {
      uri: process.env.MONGO_URI,
      collection: 'sessions',
    },
    function (error) {
      if (error) {
        console.log(error);
      }
    }
  );

  store.on('error', function (error) {
    console.log('Session store error:', error);
  });

  return store;
}

module.exports = { connectDB, createSessionStore };
