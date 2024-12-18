const moment = require('moment');
const crypto = require("crypto");
const qs = require('qs');
const vnpayConfig = require('../config/vnpay');
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const User = require('../models/User');

// Hàm sortObject được định nghĩa riêng
const sortObject = (obj) => {
    const sorted = {};
    const str = [];
    let key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) {
            str.push(encodeURIComponent(key));
        }
    }
    str.sort();
    for (key = 0; key < str.length; key++) {
        sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
    }
    return sorted;
};

class PaymentController {
    // Hiển thị form thanh toán
    getCreatePayment(req, res) {
        const amount = req.query.amount || 0;
        const orderId = req.query.orderId || '';
        res.render('payment/order', {
            layout: 'payment',
            title: 'Thanh toán',
            amount,     
            orderId   
        });
    }

    // Xử lý tạo URL thanh toán
    async createPayment(req, res) {
    try {
        process.env.TZ = 'Asia/Ho_Chi_Minh';
        
        // Validate input
        const amount = req.method === 'POST' ? req.body.amount : req.query.amount;
        const orderId = req.method === 'POST' ? req.body.orderId : req.query.orderId;
        
        if (!amount || isNaN(amount) || amount <= 0) {
        
            return res.status(400).json({
                error: 'Invalid amount'
            });
        }
        
        if (!orderId) {
            return res.status(400).json({
                error: 'OrderId is required'
            });
        }

        const date = new Date();
        const createDate = moment(date).format('YYYYMMDDHHmmss');
        
        const ipAddr = req.headers['x-forwarded-for'] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            req.connection.socket.remoteAddress;

        const { bankCode, language } = req.body;
        
        let vnp_Params = {
            vnp_Version: '2.1.0',
            vnp_Command: 'pay',
            vnp_TmnCode: vnpayConfig.vnp_TmnCode,
            vnp_Locale: language,
            vnp_CurrCode: 'VND',
            vnp_TxnRef: orderId,
            vnp_OrderInfo: 'Thanh toan cho ma GD:' + orderId,
            vnp_OrderType: 'other',
            vnp_Amount: Math.round(amount * 100),
            vnp_ReturnUrl: vnpayConfig.vnp_ReturnUrl,
            vnp_IpAddr: ipAddr,
            vnp_CreateDate: createDate,
        };
        if (bankCode) {
            vnp_Params['vnp_BankCode'] = bankCode;
        }

        // Sort and create signature
        vnp_Params = sortObject(vnp_Params);
        const signData = qs.stringify(vnp_Params, { encode: false });
        const hmac = crypto.createHmac("sha512", vnpayConfig.vnp_HashSecret);
        const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex");
        
        vnp_Params['vnp_SecureHash'] = signed;

        // Create full URL
        const vnpUrl = vnpayConfig.vnp_Url + '?' + qs.stringify(vnp_Params, { encode: false });
        res.redirect(vnpUrl);
    } catch (error) {
        res.status(500).json({
            error: 'Internal server error',
            message: error.message
        });
    }
}

    // Xử lý kết quả trả về
    vnpayReturn(req, res) {
        let vnp_Params = req.query;
        let secureHash = vnp_Params['vnp_SecureHash'];
        const orderId = vnp_Params['vnp_TxnRef'];

        delete vnp_Params['vnp_SecureHash'];
        delete vnp_Params['vnp_SecureHashType'];

        vnp_Params = sortObject(vnp_Params);

        let tmnCode = vnpayConfig.vnp_TmnCode;
        let secretKey = vnpayConfig.vnp_HashSecret;

        let signData = qs.stringify(vnp_Params, { encode: false });    
        let hmac = crypto.createHmac("sha512", secretKey);
        let signed = hmac.update(new Buffer(signData, 'utf-8')).digest("hex");    

        if(secureHash === signed){
            //Kiem tra xem du lieu trong db co hop le hay khong va thong bao ket qua

            res.render('payment/success', {
                layout: 'payment',
                code: vnp_Params['vnp_ResponseCode']
            })
        } else{
            res.render('payment/success', {
                layout: 'payment',
                code: '97'
            })
        }
    }

    // IPN URL
    async vnpayIPN(req, res) {
        
        try {
            const vnp_Params = req.query;
            const secureHash = vnp_Params['vnp_SecureHash'];
            const orderId = vnp_Params['vnp_TxnRef'];
            const rspCode = vnp_Params['vnp_ResponseCode'];
    
    
            delete vnp_Params['vnp_SecureHash'];
            delete vnp_Params['vnp_SecureHashType'];
    
            // Verify signature
            const sortedParams = sortObject(vnp_Params);
            const signData = qs.stringify(sortedParams, { encode: false });
            const hmac = crypto.createHmac("sha512", vnpayConfig.vnp_HashSecret);
            const signed = hmac.update(new Buffer(signData, 'utf-8')).digest("hex");
    
            if(secureHash === signed) {
                // Tìm order trong database
                const order = await Order.findById(orderId);
                
                if (!order) {
                    return res.status(200).json({RspCode: '01', Message: 'Order not found'});
                }
    
                // Kiểm tra số tiền
                const vnpAmount = parseInt(vnp_Params['vnp_Amount']) / 100;
                if (vnpAmount !== order.totalAmount) {
                    return res.status(200).json({RspCode: '04', Message: 'Invalid amount'});
                }
    
                // Kiểm tra trạng thái order
                if(order.status !== 'pending') {
                    return res.status(200).json({RspCode: '02', Message: 'Order already confirmed'});
                }
    
                // Cập nhật trạng thái order dựa trên kết quả thanh toán
                const updateData = {
                    status: rspCode === '00' ? 'completed' : 'canceled'
                };
    
                await Order.findByIdAndUpdate(orderId, updateData);

                // Cập nhật trạng thái giỏ hàng
                if (rspCode === '00') {
                    await Cart.findOneAndUpdate({ userId: order.userId, isPaid: false }, { isPaid: true });
                }

                // Cập nhật danh sách sản phẩm đã mua trong metadata của người dùng
                const user = await User.findById(order.userId);
                console.log('user: ', user);

                if (user) {
                    // Lấy productIds từ items của order
                    const purchasedProducts = order.items.map(item => item.productId);
                    
                    // Khởi tạo metadata.purchasedProducts nếu chưa có
                    user.metadata = user.metadata || {};
                    user.metadata.purchasedProducts = user.metadata.purchasedProducts || [];
                    
                    // Thêm các sản phẩm mới vào purchasedProducts
                    user.metadata.purchasedProducts.push(...purchasedProducts);
                    
                    console.log('user is updated');
                    await user.save();
                }
    
                return res.status(200).json({RspCode: '00', Message: 'Success'});
    
            } else {
                return res.status(200).json({RspCode: '97', Message: 'Invalid signature'});
            }
    
        } catch (error) {
            return res.status(200).json({RspCode: '99', Message: 'Internal error'});
        }
    }
}

module.exports = new PaymentController();