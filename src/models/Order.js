const mongoose = require('mongoose');
const schedule = require('node-schedule');

const OrderItemSchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    reviewStatus: {
      type: String,
      enum: ['not-reviewed', 'reviewed'],
      default: 'not-reviewed',
    },
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
  },
  { timestamps: true }
);

// Middleware to set the status of an order to 'canceled' after 15 minutes
OrderSchema.pre('save', function (next) {
  if (this.isNew && this.status === 'pending') {
    schedule.scheduleJob(new Date(Date.now() + 15 * 60 * 1000), async () => {
      const order = await mongoose.model('Order').findById(this._id);
      if (order && order.status === 'pending') {
        order.status = 'canceled';
        console.log(`Order ${order._id} has been canceled`);
        await order.save();
      }
    });
  }
  next();
});

module.exports = mongoose.model('Order', OrderSchema, 'orders');
