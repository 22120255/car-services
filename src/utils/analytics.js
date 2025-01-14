const { BetaAnalyticsDataClient } = require('@google-analytics/data');

const analyticsDataClient = new BetaAnalyticsDataClient();

const getViewsData = async (propertyId) => {
    const [viewsResponse] = await analyticsDataClient.runReport({
        property: `properties/${propertyId}`,
        dateRanges: [
            {
                startDate: '30daysAgo',
                endDate: 'today',
            },
        ],
        metrics: [
            {
                name: 'activeUsers',
            },
        ],
    });
    const res = parseInt(viewsResponse.rows[0]?.metricValues[0]?.value || '0', 10)

    return res;
}

const getTopProductsData = async (propertyId, amount) => {
    const [topProductsResponse] = await analyticsDataClient.runReport({
        property: `properties/${propertyId}`,
        dateRanges: [
            {
                startDate: '30daysAgo',
                endDate: 'today',
            },
        ],
        dimensions: [
            {
                name: 'eventName',
            },
            {
                name: 'customEvent:product_id',
            },
        ],
        metrics: [
            {
                name: 'eventCount',
            },
        ],
        orderBys: [
            {
                metric: {
                    metricName: 'eventCount',
                },
                desc: true,
            },
        ],
        limit: amount,
    });
    const res = topProductsResponse.rows.map(row => row.dimensionValues[0].value);

    return res;
}
module.exports = { getViewsData, getTopProductsData };
