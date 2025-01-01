const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { ObjectID } = require('mongodb');

const UserSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, select: false },
    avatar: { type: String },
    role: {
      name: {
        type: String,
        required: true,
        enum: ['user', 'admin', 'sadmin'],
        default: 'user',
      },
      description: { type: String },
      permissions: [
        {
          type: String,
          enum: [
            'manage_users', // Quản lý người dùng
            'manage_admins', // Quản lý admin (chỉ sadmin)
            'manage_system', // Quản lý hệ thống
          ],
        },
      ],
    },
    status: { type: String, enum: ['active', 'inactive', 'suspended'], default: 'inactive' },
    verificationCode: { type: String },
    lastLogin: { type: Date },

    metadata: {
      phone: { type: String },
      address: { type: String },
      purchasedProducts: [
        {
          orderId: { 
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Order',
          },
          product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
          },
          purchaseDate:{
            type: Date,
            default: Date.now,
          },
          quantity: { type: Number, default: 1 },
        }
      ],
      favoriteProducts: [
        {
          // When user click favorite product, it will added here
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
        },
      ],
      recentActivity: [
        {
          type: { type: String, enum: ['purchase', 'search'] },
          date: { type: Date, default: Date.now },
          description: String,
        },
      ],
    },
    // Thông tin thêm cho admin
    adminStats: {
      totalCars: { type: Number, default: 0 },
      soldCars: { type: Number, default: 0 },
      monthlyRevenue: { type: Number, default: 0 },
      popularBrand: { type: String },
      avgSalePrice: { type: Number, default: 0 },
      satisfaction: { type: Number, min: 0, max: 5, default: 0 },
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
UserSchema.index({ email: 1 });
UserSchema.index({ 'metadata.phone': 1 });
UserSchema.index({ status: 1 });

UserSchema.pre('save', async function (next) {
  try {
    const user = this;

    // Set permissions based on role
    if (this.role.name === 'sadmin') {
      this.role.permissions = ['manage_users', 'manage_admins', 'manage_system'];
    } else if (this.role.name === 'admin') {
      this.role.permissions = ['manage_users', 'manage_system'];
    } else if (this.role.name === 'user') {
      this.role.permissions = [];
    }

    // Hash password if modified
    if (!user.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword;
    next();
  } catch (error) {
    return next(error);
  }
});

// Method to compare password
UserSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw error;
  }
};

module.exports = mongoose.model('User', UserSchema, 'users');
