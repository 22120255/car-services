const Chance = require('chance');
const chance = new Chance();
const mongoose = require('mongoose');
const Product = require('../models/Product'); // Assuming you have a Product model

// Predefined options
const years = [
    { value: '2023', name: '2023' },
    { value: '2022', name: '2022' },
    { value: '2021', name: '2021' },
    { value: '2020', name: '2020' },
    { value: '2019', name: '2019' },
    { value: '2018', name: '2018' }
];

const brands = [
    { name: 'audi' },
    { name: 'BMW' },
    { name: 'ford' },
    { name: 'kia' },
    { name: 'honda' },
    { name: 'hyundai' },
    { name: 'mitsubishi' },
    { name: 'toyota' },
    { name: 'vinfast' }
];

const statuses = [
    { name: 'new', description: 'Xe mới' },
    { name: 'used', description: 'Đã qua sử dụng' },
    { name: 'sold', description: 'Xe bảo hành' }
];

const transmissions = [
    { name: 'manual' },
    { name: 'automatic' }
];

// Hàm lấy tất cả các category_id từ database
const categories = [
    { name: 'sedan' },
    { name: 'suv' },
    { name: 'truck' },
    { name: 'roadster' },
];

// Hàm tạo dữ liệu sản phẩm giả
async function generateMockProducts(num = 10) {

    for (let i = 0; i < num; i++) {
        const randomCategoryId = chance.pickone(categoryIds); // Random category_id từ mảng
        const randomBrand = chance.pickone(brands); // Random brand from predefined brands
        const randomStatus = chance.pickone(statuses); // Random status
        const randomTransmission = chance.pickone(transmissions); // Random transmission
        const randomYear = chance.pickone(years); // Random year from predefined years
        const randomCategory = chance.pickone(categories); // Random category

        products.push({
            brand: randomBrand.name,
            description: chance.sentence({ words: 30 }), // Random sentence for description
            horsepower: chance.integer({ min: 100, max: 500 }), // Random horsepower
            images: {
                image1: "",
                image2: "",
                image3: "",
                image4: "",
                image5: "",
            },
            mileage: chance.integer({ min: 0, max: 500 }), // Random mileage
            model: chance.word(), // Random model name
            price: chance.integer({ min: 20000, max: 200000 }), // Random price
            transmission: randomTransmission.name, // Random transmission type
            category: randomCategoryId, // Random category_id
            status: randomStatus.name, // Random status
            year: (randomYear.name), // Convert year to a number
        });
    }

    return products;
}

module.exports = generateMockProducts;
