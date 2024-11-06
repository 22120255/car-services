const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    full_name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password_hash: { type: String, required: true },
    role: { type: String, enum: ['customer', 'admin'], default: 'customer' },
    is_active: { type: Boolean, default: true },
}, {timestamps: true})

module.exports = mongoose.model('User', UserSchema, 'users')
