const mongoose = require('mongoose');

const OrderItemSchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
  },
  { timestamps: true }
);

const OrderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    items: [OrderItemSchema],
    totalAmount: { type: Number, required: true },
    shippingDetails: { type: String, required: true },
    status: {
      type: String,
      enum: ['pending', 'completed', 'canceled'],
      default: 'pending',
    },
    reviewStatus: {
      type: String,
      enum: ['not-reviewed', 'reviewed'],
      default: 'not-reviewed',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', OrderSchema, 'orders');
