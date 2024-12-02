const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema(
  {
    brand: { type: String, required: true },
    description: { type: String, required: true },
    horsepower: { type: Number, required: true },
    images: [{ type: String, required: false }],
    mileage: { type: Number, required: true },
    model: { type: String, required: true },
    price: { type: Number, required: true },
    transmission: { type: String, required: true },
    style: { type: String, required: true },
    status: {
      type: String,
      enum: ['new', 'used', 'sold'],
      default: 'new',
    },
    year: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', ProductSchema, 'products');
