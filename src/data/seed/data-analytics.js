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
      "676783b0d3561a62b3132379",
      "676783b0d3561a62b313237a",
      "676783b0d3561a62b313237b",
      "676783b0d3561a62b313237c",
      "676783b0d3561a62b313237d",
      "676783b0d3561a62b313237e",
      "676783b0d3561a62b313237f",
      "676783b0d3561a62b3132380",
      "676783b0d3561a62b3132381",
      "676783b0d3561a62b3132382",
    ],
    topProductsPurchased: [
      "676783b0d3561a62b3132379",
      "676783b0d3561a62b313237a",
      "676783b0d3561a62b313237b",
      "676783b0d3561a62b313237c",
      "676783b0d3561a62b313237d",
      "676783b0d3561a62b313237e",
      "676783b0d3561a62b313237f",
      "676783b0d3561a62b3132380",
      "676783b0d3561a62b3132381",
      "676783b0d3561a62b3132382",
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
