const Chance = require('chance');
const mongoose = require('mongoose');
const Accessory = require('../../models/Accessory');

require('dotenv').config({ path: process.env.NODE_ENV === 'development' ? `.env.dev` : '.env' });

const chance = new Chance();

// Predefined options
const categories = [
    'interior',
    'exterior',
    'performance',
    'electronics',
    'other'
];

const accessoryNames = {
    interior: ['Floor Mats', 'Seat Covers', 'Steering Wheel Cover', 'Dashboard Cover', 'Interior LED Lights'],
    exterior: ['Roof Rack', 'Window Tint', 'Body Kit', 'Spoiler', 'Chrome Trim'],
    performance: ['Air Filter', 'Exhaust System', 'Suspension Kit', 'Brake Pads', 'Turbocharger'],
    electronics: ['Car Stereo', 'Backup Camera', 'GPS Navigator', 'Dash Cam', 'Car Alarm'],
    other: ['Car Cover', 'First Aid Kit', 'Tool Kit', 'Jump Starter', 'Air Freshener']
};

const brands = ['AutoZone', 'Bosch', 'K&N', 'Brembo', 'Alpine', 'Thule', '3M', 'Meguiar\'s'];

const images = [
    "https://www.heyelly.com/wp-content/uploads/2024/11/c92891f-768x768.jpeg",
    "https://th.bing.com/th/id/OIP.QtYReRN0XbeY2FuEXnDW5wHaFe?w=217&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7",
    "https://th.bing.com/th?q=Car+Interior+Accessory&w=120&h=120&c=1&rs=1&qlt=90&cb=1&dpr=1.3&pid=InlineBlock&mkt=en-US&cc=US&setlang=vi&adlt=strict&t=1&mw=247",
    "https://th.bing.com/th?q=Car+Audio+Accessory&w=120&h=120&c=1&rs=1&qlt=90&cb=1&dpr=1.3&pid=InlineBlock&mkt=en-US&cc=US&setlang=vi&adlt=strict&t=1&mw=247",
    "https://th.bing.com/th/id/OIP.qLWkIyxw_bKS8dMg4C3kQQHaLH?w=126&h=189&c=7&r=0&o=5&dpr=1.3&pid=1.7"
];

// Generate mock accessory data
async function generateMockAccessories(num = 50) {
    const accessories = [];

    for (let i = 0; i < num; i++) {
        const category = chance.pickone(categories);
        const name = chance.pickone(accessoryNames[category]);
        const price = chance.floating({ min: 100000, max: 1000000, fixed: 2 });

        const numImages = chance.integer({ min: 1, max: 3 });
        const accessoryImages = [];
        for (let j = 0; j < numImages; j++) {
            accessoryImages.push(chance.pickone(images));
        }

        accessories.push({
            name,
            description: chance.sentence({ words: 20 }),
            price: price,
            importPrice: price * 0.7, // Import price is 70% of selling price
            brand: chance.pickone(brands),
            category,
            images: accessoryImages,
            stock: chance.integer({ min: 0, max: 100 }),
            status: chance.weighted(['available', 'unavailable'], [4, 1])
        });
    }

    return accessories;
}

const seedAccessories = async () => {
    try {
        // Connect to database
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        // Delete existing accessories
        await Accessory.deleteMany({});
        console.log('Deleted existing accessories');

        // Generate mock accessories
        const mockAccessories = await generateMockAccessories();

        // Insert new accessories
        const createdAccessories = await Accessory.insertMany(mockAccessories);
        console.log(`Created ${createdAccessories.length} new accessories`);

        console.log('Accessory seeding completed successfully');
    } catch (error) {
        console.error('Error seeding accessories:', error);
    } finally {
        // Close connection
        await mongoose.connection.close();
        console.log('Disconnected from MongoDB');
    }
};

// Run seeder
seedAccessories();
