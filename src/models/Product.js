const mongoose = require('mongoose')
const { FALSE } = require('node-sass')

const ProductSchema = new mongoose.Schema({
    brand: { type: String, required: true },
    description: { type: String, required: true },
    horsepower: { type: Number, required: true },
    image: { type: String, required: true },
    mileage: { type: Number, required: true },
    model: { type: String, required: true },
    price: { type: Number, required: true },
    transmission: { type: String, required: true },
    category_id: { type: mongoose.Schema.Types.ObjectId, ref: 'categories' },
    status: {
        type: String,
        enum: ['new', 'used', 'sold'],
        default: 'new',
    },
    year: { type: Number, required: true },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
})

module.exports = mongoose.model('Product', ProductSchema)
