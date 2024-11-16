const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, select: false },
    avatar: { type: String },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    status: { type: String, enum: ['active', 'inactive', 'suspended'], default: 'inactive' },
    verificationCode: { type: String },
    lastLogin: { type: Date },

    metadata: {
        phone: { type: String },
        address: { type: String },
        purchasedCars: [{
            brand: String,
            model: String,
            year: Number,
            mileage: Number,
            image: String
        }],
        recentActivity: [{
            type: { type: String, enum: ['purchase', 'search'] },
            date: { type: Date, default: Date.now },
            description: String
        }]
    },
    // Thông tin thêm cho admin
    adminStats: {
        totalCars: { type: Number, default: 0 },
        soldCars: { type: Number, default: 0 },
        monthlyRevenue: { type: Number, default: 0 },
        popularBrand: { type: String },
        avgSalePrice: { type: Number, default: 0 },
        satisfaction: { type: Number, default: 0 }
    }
}, { timestamps: true });

UserSchema.pre('save', async function (next) {
    try {
        const user = this;
        if (!user.isModified('password')) next();
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(this.password, salt);
        this.password = hashedPassword;
        next();
    } catch (error) {
        return next(error);
    }
});
module.exports = mongoose.model('User', UserSchema, 'users')