const mongoose = require('mongoose');

const DataAnalytics = new mongoose.Schema({
    propertyId: { type: String, required: true },
    views: { type: Number, default: 0 },
    topProductsView: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    topProductsPurchased: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
}, {
    timestamps: true
})

module.exports = mongoose.model('DataAnalytics', DataAnalytics, 'dataAnalytics');