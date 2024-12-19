const mongoose = require('mongoose');

const DataAnalytics = new mongoose.Schema({
    propertyId: { type: String, required: true },
    views: { type: Number, default: 0 },
}, {
    timestamps: true
})

module.exports = mongoose.model('DataAnalytics', DataAnalytics, 'dataAnalytics');