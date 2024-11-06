// // mockProducts.js  
// const mongoose = require('mongoose');  
// const { faker } = require('@faker-js/faker');  
// const Product = require('../models/Product'); // Adjust the path to your product model  

// // Connect to MongoDB (Adjust the connection string as necessary)  
// const mongoURI = 'mongodb://localhost:27017/your_database_name'; // Change 'your_database_name' to your actual database  
// mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })  
//     .then(() => console.log("MongoDB connection successful"))  
//     .catch(err => console.error(err));  

// const generateMockProducts = (num) => {  
//     const products = [];  

//     for (let i = 0; i < num; i++) {  
//         const product = {  
//             name: faker.commerce.productName(),  
//             description: faker.commerce.productDescription(),  
//             price: parseFloat(faker.commerce.price()),  
//             manufacturer: faker.company.companyName(),  
//             category_id: null, // Assuming you will set this later or link to a category  
//             status: faker.helpers.arrayElement(['in_stock', 'out_of_stock', 'suspended']),  
//             image: faker.image.imageUrl(),  
//             year: faker.date.past(30).getFullYear(), // Generate a year in the past 30 years  
//             created_at: new Date(),  
//             updated_at: new Date()  
//         };  

//         products.push(product);  
//     }  

//     return products;  
// };  

// // Function to insert mock data into MongoDB  
// const seedDatabase = async (num) => {  
//     const products = generateMockProducts(num);  

//     try {  
//         const result = await Product.insertMany(products); // Bulk insert  
//         console.log(`Inserted ${result.length} products!`);  
//     } catch (err) {  
//         console.error(err);  
//     } finally {  
//         mongoose.connection.close(); // Close the connection  
//     }  
// };  

// // Seed the database with 20 mock products  
// seedDatabase(20);