const Chance = require('chance');
const mongoose = require('mongoose');
const Product = require('../../models/Product');

require('dotenv').config({ path: process.env.NODE_ENV === 'development' ? `.env.dev` : '.env' });

const chance = new Chance();

// Predefined options
const years = [
    { value: '2024', name: '2024' },
    { value: '2023', name: '2023' },
    { value: '2022', name: '2022' },
    { value: '2021', name: '2021' },
    { value: '2020', name: '2020' },
    { value: '2019', name: '2019' },
    { value: '2018', name: '2018' },
];

const brands = [
    { name: 'Audi', value: 'audi' },
    { name: 'BMW', value: 'BMW' },
    { name: 'Ford', value: 'ford' },
    { name: 'Kia', value: 'kia' },
    { name: 'Honda', value: 'honda' },
    { name: 'Hyundai', value: 'hyundai' },
    { name: 'Mazda', value: 'mazda' },
    { name: 'Mercedes-Benz', value: 'mercedes-benz' },
    { name: 'Mitsubishi', value: 'mitsubishi' },
    { name: 'Toyota', value: 'toyota' },
    { name: 'Vinfast', value: 'vinfast' },
];

const statuses = [
    { value: 'new', name: 'New' },
    { value: 'used', name: 'Used' },
    { value: 'sold', name: 'Sold' },
];

const fuelTypes = [
    { value: 'petrol', name: 'Petrol' },
    { value: 'diesel', name: 'Diesel' },
    { value: 'electric', name: 'Electric' },
    { value: 'hybrid', name: 'Hybrid' },
];

const transmissions = [
    { value: 'manual', name: 'Manual' },
    { value: 'automatic', name: 'Automatic' },
];

const styles = [
    { value: 'sedan', name: 'Sedan' },
    { value: 'suv', name: 'SUV' },
    { value: 'truck', name: 'Truck' },
    { value: 'roadster', name: 'Roadster' },
];

const images = [
    "https://th.bing.com/th/id/OIP.bacWE2DlJQTSbG6kvNrzegHaEK?w=294&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7",
    "https://th.bing.com/th/id/OIP.oj71K58ycqUwDzhd0htVTAHaE8?w=247&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7",
    "https://th.bing.com/th/id/OIP.VHe1DTnuwc6ZHYcAjUx0xQHaEo?w=265&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7",
    "https://th.bing.com/th/id/OIP.ZJsKuclJ-UQkYsu0gX07kgHaEK?w=327&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7",
    "https://th.bing.com/th/id/OIP.O0OgGqd302V7N9FgQRutbQHaEK?w=276&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7",
    "https://th.bing.com/th/id/OIP.ub-P47_nHrWCHRdfkohbYwHaEK?w=276&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7",
    "https://th.bing.com/th/id/OIP.DhPAvXQomIwJa3U9YyD2rwHaEZ?w=313&h=185&c=7&r=0&o=5&dpr=1.3&pid=1.7",
    "https://th.bing.com/th/id/OIP.d21yYgnOg-9AIZ8aPBoX4AHaEK?w=334&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7",
    "https://th.bing.com/th/id/OIP.9SvbBE2eqd8mW5ivYvrQygHaEV?w=311&h=182&c=7&r=0&o=5&dpr=1.3&pid=1.7",
    "https://th.bing.com/th/id/OIP.3Brdwh_2i_ebzbLYpzNHqAHaEo?w=277&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7"
]

// Generate mock product data
async function generateMockProducts(num = 10) {
    const products = [];

    for (let i = 0; i < num; i++) {
        const randomBrand = chance.pickone(brands);
        const randomStatus = chance.pickone(statuses);
        const randomTransmission = chance.pickone(transmissions);
        const randomYear = chance.pickone(years);
        const randomStyle = chance.pickone(styles);
        const randomFuelType = chance.pickone(fuelTypes);
        const price = chance.integer({ min: 20000, max: 200000 });
        const numImages = chance.integer({ min: 1, max: 5 });
        const productImages = [];
        for (let j = 0; j < numImages; j++) {
            productImages.push(chance.pickone(images));
        }

        products.push({
            brand: randomBrand.name,
            description: chance.sentence({ words: 30 }),
            horsepower: chance.integer({ min: 100, max: 500 }),
            images: productImages,
            mileage: chance.integer({ min: 0, max: 500 }),
            model: chance.word(),
            price: price,
            importPrice: price * 0.7,
            transmission: randomTransmission.value,
            status: randomStatus.value,
            fuelType: randomFuelType.value,
            year: randomYear.value,
            style: randomStyle.value,
        });
    }

    return products;
}

const seedProducts = async () => {
    try {
        // Connect to database
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        // Delete existing products
        await Product.deleteMany({});
        console.log('Deleted existing products');

        // Generate mock products
        const mockProducts = await generateMockProducts(100);

        // Insert new products
        const createdProducts = await Product.insertMany(mockProducts);
        console.log(`Created ${createdProducts.length} new products`);

        console.log('Product seeding completed successfully');
    } catch (error) {
        console.error('Error seeding products:', error);
    } finally {
        // Close connection
        await mongoose.connection.close();
        console.log('Disconnected from MongoDB');
    }
};

// Run seeder
seedProducts();