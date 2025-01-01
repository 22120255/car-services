const mongoose = require('mongoose');

const DataAnalytics = new mongoose.Schema({
    propertyId: { type: String, required: true },
    views: { type: Number, default: 0 },
    topProductsView: [{
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        count: { type: Number, default: 0 }
    }],
    topProductsPurchased: [{
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        count: { type: Number, default: 0 }
    }],
}, {
    timestamps: true
})

module.exports = mongoose.model('DataAnalytics', DataAnalytics, 'dataAnalytics');