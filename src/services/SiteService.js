const DataAnalytics = require("../models/DataAnalytics");
const Formatter = require('../utils/formatter');
const { getDataReport } = require("../config/analytics");

class SiteService {
    // Lấy dữ liệu thống kê
    async getAnalytics(options = { refresh: false }) {
        if (options.refresh) {
            await getDataReport();
        }
        try {
            const analytics = await DataAnalytics.findOne({}).sort({ createdAt: -1 })
                .populate("topProductsView.productId").populate("topProductsPurchased.productId").lean();

            let result = null;

            if (analytics) {
                result = {
                    ...analytics,
                    createdAtStr: Formatter.formatDate(analytics.createdAt),
                    views: Formatter.formatNumber(analytics.views, { decimal: 0 }),
                    topProductsView: analytics.topProductsView.map(item => ({
                        ...item.productId,
                        price: Formatter.formatCurrency(item.productId.price),
                        views: Formatter.formatNumber(item.count, { decimal: 0 }),
                    })),
                    topProductsPurchased: analytics.topProductsPurchased.map(item => ({
                        ...item.productId,
                        price: Formatter.formatCurrency(item.productId.price),
                        views: Formatter.formatNumber(item.count, { decimal: 0 }),
                    })),
                }
            }

            return result;
        } catch (error) {
            console.error('Error fetching analytics:', error);
            throw error;
        }
    }
}

module.exports = new SiteService();