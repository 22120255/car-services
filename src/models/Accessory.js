const mongoose = require('mongoose')

const AccessorySchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        description: { type: String, required: true },
        price: { type: Number, required: true },
        importPrice: { type: Number, required: true },
        brand: { type: String },
        compatibleCars: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Car' }], // Phụ kiện tương thích với xe nào
        category: {
            type: String,
            enum: ['interior', 'exterior', 'performance', 'electronics', 'other'],
            required: true
        },
        images: [{ type: String }],
        stock: { type: Number, default: 0 },
        status: { type: String, enum: ['available', 'unavailable'], default: 'available' },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Accessory', AccessorySchema, 'accessories');
