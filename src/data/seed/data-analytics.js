const Chance = require('chance');
const mongoose = require('mongoose');
const DataAnalytics = require('../../models/DataAnalytics');
const Product = require('../../models/Product');

require('dotenv').config({ path: process.env.NODE_ENV === 'development' ? `.env.dev` : '.env' });


// Generate mock product data
async function generateMockDataAnalytics() {
  const products = await Product.find({}, '_id').lean()
  const shuffledProducts = products.sort(() => 0.5 - Math.random()).slice(0, 20);
  const topProductsView = shuffledProducts.slice(0, 10).map((product, index) => ({
    productId: product._id,
    count: 10000 - index * 1000, // Giảm dần số lượng
  }));

  const topProductsPurchased = shuffledProducts.slice(10, 20).map((product, index) => ({
    productId: product._id,
    count: 15000 - index * 1500, // Giảm dần số lượng
  }));
  const dataAnalytics = [{
    propertyId: "465737102",
    views: 100000,
    topProductsView,
    topProductsPurchased,
  }];

  return dataAnalytics;
}

const seedDataAnalytics = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Delete existing products
    // await Product.deleteMany({});
    // console.log('Deleted existing products');

    // Generate mock products
    const mockDataAnalytics = await generateMockDataAnalytics();

    // Insert new products
    const createdProducts = await DataAnalytics.insertMany(mockDataAnalytics);
    console.log(`Created ${createdProducts.length} new data analytics`);

  } catch (error) {
    console.error('Error seeding products:', error);
  } finally {
    // Close connection
    await mongoose.connection.close();
    console.log('Disconnected from MongoDB');
  }
};

// Run seeder
seedDataAnalytics();
