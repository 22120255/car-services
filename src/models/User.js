const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHashed: { type: String },
    role: { type: String, enum: ['customer', 'admin'], default: 'customer' },
    isActivated: { type: Boolean, default: false },
    activationToken: { type: String },
});

module.exports = mongoose.model('User', UserSchema);  