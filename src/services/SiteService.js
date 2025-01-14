const DataAnalytics = require("../models/DataAnalytics");
const Formatter = require('../utils/formatter');
const { getDataReport } = require("../config/analytics");
const Order = require("../models/Order");
const moment = require('moment');

class SiteService {
    // Lấy dữ liệu thống kê
    async getAnalytics(options = {}) {
        const { refresh = false, time, interval } = options;
        if (refresh) {
            await getDataReport();
        }
        const analytics = await DataAnalytics.findOne({}).sort({ createdAt: -1 })
            .populate("topProductsView.productId").populate("topProductsPurchased.productId").lean();

        let result = null;

        if (analytics) {
            result = {
                ...analytics,
                createdAtStr: Formatter.formatDate(analytics.createdAt),
                views: analytics.views,
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

        const endDate = moment(time).endOf('day');
        const startDate = moment(time).subtract(interval, 'months').startOf('day');

        const dailyRevenue = await Order.aggregate([
            {
                $match: {
                    status: 'completed',
                    createdAt: { $gte: startDate.toDate(), $lte: endDate.toDate() },
                }
            },
            {
                $group: {
                    _id: {
                        $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
                    },
                    totalRevenue: { $sum: '$totalAmount' },
                }
            },
            { $sort: { _id: 1 } }
        ]);

        const purchased = await Order.countDocuments({
            status: 'completed',
            createdAt: { $gte: startDate.toDate(), $lte: endDate.toDate() },
        })

        return {
            ...result,
            dailyRevenue,
            purchased,
        };
    }
}

module.exports = new SiteService();