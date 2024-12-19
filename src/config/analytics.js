const { BetaAnalyticsDataClient } = require('@google-analytics/data');
const DataAnalytics = require("../models/DataAnalytics");

const propertyId = "465737102";

const analyticsDataClient = new BetaAnalyticsDataClient();

async function runReport() {
    const [response] = await analyticsDataClient.runReport({
        property: `properties/${propertyId}`,
        dateRanges: [
            {
                startDate: '30daysAgo', endDate: 'today'
            },
        ],
        metrics: [
            {
                name: 'activeUsers',
            },
        ],
    });

    for (const row of response.rows) {
        const newRecord = new DataAnalytics({
            propertyId,
            views: parseInt(row.metricValues[0].value, 10),
        });

        await newRecord.save();
    }
}

module.exports = { runReport };