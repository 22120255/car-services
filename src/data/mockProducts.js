const Chance = require('chance')
const chance = new Chance()
const mongoose = require('mongoose')
const Product = require('../models/Product') // Assuming you have a Product model

// Predefined options
const years = [
    { value: '2024', name: '2024' },
    { value: '2023', name: '2023' },
    { value: '2022', name: '2022' },
    { value: '2021', name: '2021' },
    { value: '2020', name: '2020' },
    { value: '2019', name: '2019' },
    { value: '2018', name: '2018' },
]

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
]

const statuses = [
    { name: 'new', label: 'Xe mới' },
    { name: 'used', label: 'Đã qua sử dụng' },
    { name: 'sold', label: 'Xe đã bán' },
]

const transmissions = [
    { name: 'manual', label: 'Manual' },
    { name: 'automatic', label: 'Automatic' },
]

// Hàm lấy tất cả các category_id từ database
const categories = [
    { name: 'sedan', label: 'Sedan' },
    { name: 'suv', label: 'SUV' },
    { name: 'truck', label: 'Truck' },
    { name: 'roadster', label: 'Roadster' },
]

// Hàm tạo dữ liệu sản phẩm giả
async function generateMockProducts(num = 10) {
    const products = []

    for (let i = 0; i < num; i++) {
        const randomBrand = chance.pickone(brands) // Random brand from predefined brands
        const randomStatus = chance.pickone(statuses) // Random status
        const randomTransmission = chance.pickone(transmissions) // Random transmission
        const randomYear = chance.pickone(years) // Random year from predefined years
        const randomCategory = chance.pickone(categories) // Random category

        products.push({
            brand: randomBrand.name,
            description: chance.sentence({ words: 30 }), // Random sentence for description
            horsepower: chance.integer({ min: 100, max: 500 }), // Random horsepower
            images: {
                image1: 'https://th.bing.com/th/id/OIP.laEUfx2v3Vk1jCnGMoFC6wHaFj?w=234&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7',
                image2: 'https://th.bing.com/th/id/OIP.laEUfx2v3Vk1jCnGMoFC6wHaFj?w=234&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7',
                image3: 'https://th.bing.com/th/id/OIP.laEUfx2v3Vk1jCnGMoFC6wHaFj?w=234&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7',
                image4: 'https://th.bing.com/th/id/OIP.laEUfx2v3Vk1jCnGMoFC6wHaFj?w=234&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7',
                image5: 'https://th.bing.com/th/id/OIP.laEUfx2v3Vk1jCnGMoFC6wHaFj?w=234&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7',
            },
            mileage: chance.integer({ min: 0, max: 500 }), // Random mileage
            model: chance.word(), // Random model name
            price: chance.integer({ min: 20000, max: 200000 }), // Random price
            transmission: randomTransmission.name, // Random transmission type
            status: randomStatus.name, // Random status
            year: randomYear.name, // Convert year to a number
            category: randomCategory.name,
        })
    }

    return products
}

module.exports = {
    generateMockProducts,
    brands,
    statuses,
    transmissions,
    years,
    categories,
}
