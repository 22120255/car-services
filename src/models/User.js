const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, select: false },
    avatar: { type: String },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    isActivated: { type: Boolean, default: false },
    verificationCode: { type: String },
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
