const DataAnalytics = require("../models/DataAnalytics");
const { getViewsData, getTopProductsData } = require('../utils/analytics');
const { errorLog, infoLog } = require("../utils/customLog");

const propertyId = process.env.GA_PROPERTY_ID;

async function getDataReport() {
    try {
        const viewData = await getViewsData(propertyId);

        // const topProductsData = await getTopProductsData(propertyId, 3);
        const lastRecord = await DataAnalytics.findOne({ propertyId })
            .sort({ createdAt: -1 })
            .exec();
        const topProductsView = lastRecord?.topProductsView || [];
        const topProductsPurchased = lastRecord?.topProductsPurchased || [];

        // Save to database
        const newRecord = new DataAnalytics({
            propertyId,
            views: viewData,
            topProductsView,
            topProductsPurchased
        });

        await newRecord.save();
        infoLog("analytics.js", "getDataReport", "Crawl data successfully");
    } catch (err) {
        errorLog("analytics.js", "getDataReport", err);
    }
}

module.exports = { getDataReport };
