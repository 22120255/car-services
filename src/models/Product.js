const mongoose = require('mongoose');
const mongooseDelete = require('mongoose-delete');

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

// Add plugin
ProductSchema.plugin(mongooseDelete, { overrideMethods: 'all' });

// Hook trước khi xóa mềm
ProductSchema.pre('softDelete', async function (next, options) {
  if (options.userDelete) {
    this.set('userDelete', options.userDelete); // Thêm trường dynamic userDelete
    await this.save();
  }
  next();
});

// Hook trước khi khôi phục
ProductSchema.pre('restore', async function (next) {
  this.unset('userDelete'); // Xóa trường dynamic userDelete
  await this.save();
  next();
});

module.exports = mongoose.model('Product', ProductSchema, 'products');
