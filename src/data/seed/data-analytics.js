const Chance = require('chance');
const mongoose = require('mongoose');
const DataAnalytics = require('../../models/DataAnalytics');
require('dotenv').config({ path: process.env.NODE_ENV === 'development' ? `.env.dev` : '.env' });


// Generate mock product data
async function generateMockDataAnalytics() {
  const dataAnalytics = [{
    propertyId: "465737102",
    views: 100000,
    topProductsView: [
      { productId: "676783b0d3561a62b3132379", count: 10000 },
      { productId: "676783b0d3561a62b313237a", count: 8000 },
      { productId: "676783b0d3561a62b313237b", count: 7000 },
      { productId: "676783b0d3561a62b313237c", count: 6000 },
      { productId: "676783b0d3561a62b313237d", count: 5000 },
      { productId: "676783b0d3561a62b313237e", count: 4000 },
      { productId: "676783b0d3561a62b313237f", count: 3000 },
      { productId: "676783b0d3561a62b3132380", count: 2000 },
      { productId: "676783b0d3561a62b3132381", count: 1000 },
      { productId: "676783b0d3561a62b3132382", count: 500 },
    ],
    topProductsPurchased: [
      { productId: "676783b0d3561a62b3132379", count: 9000 },
      { productId: "676783b0d3561a62b313237a", count: 7000 },
      { productId: "676783b0d3561a62b313237b", count: 6500 },
      { productId: "676783b0d3561a62b313237c", count: 5000 },
      { productId: "676783b0d3561a62b313237d", count: 4000 },
      { productId: "676783b0d3561a62b313237e", count: 3500 },
      { productId: "676783b0d3561a62b313237f", count: 2000 },
      { productId: "676783b0d3561a62b3132380", count: 1500 },
      { productId: "676783b0d3561a62b3132381", count: 1000 },
      { productId: "676783b0d3561a62b3132382", count: 500 },
    ],
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
