const moment = require('moment');
const crypto = require("crypto");
const qs = require('qs');
const { getConfig } = require('../config/vnpay');
const vnpayConfig = getConfig();
const Order = require('../models/Order');
const Cart = require('../models/Cart');

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
        //console.log("query", req.query);
        console.log(amount, orderId);
        if (!amount || isNaN(amount) || amount <= 0) {
            console.log('Invalid amount:', amount);
        
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
            vnp_IpnUrl: vnpayConfig.vnp_IpnUrl
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
        console.log('Payment URL:', vnpUrl);
        res.redirect(vnpUrl);
    } catch (error) {
        console.error('Error creating payment:', error);
        res.status(500).json({
            error: 'Internal server error',
            message: error.message
        });
    }
}

    // Xử lý kết quả trả về
    vnpayReturn(req, res) {
        console.log('return is called');
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
        console.log("Response code: ", vnp_Params['vnp_ResponseCode']);


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
        console.log('ipn is called');
        
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
                    console.log('Order not found:', orderId);
                    return res.status(200).json({RspCode: '01', Message: 'Order not found'});
                }
    
                // Kiểm tra số tiền
                const vnpAmount = parseInt(vnp_Params['vnp_Amount']) / 100;
                if (vnpAmount !== order.totalAmount) {
                    console.log('Amount mismatch:', {
                        vnpAmount,
                        orderAmount: order.totalAmount
                    });
                    return res.status(200).json({RspCode: '04', Message: 'Invalid amount'});
                }
    
                // Kiểm tra trạng thái order
                if(order.status !== 'pending') {
                    console.log('Order already processed:', {
                        orderId,
                        currentStatus: order.status
                    });
                    return res.status(200).json({RspCode: '02', Message: 'Order already confirmed'});
                }
    
                // Cập nhật trạng thái order dựa trên kết quả thanh toán
                const updateData = {
                    status: rspCode === '00' ? 'completed' : 'canceled'
                };
    
                console.log('Updating order:', {
                    orderId,
                    updateData
                });
    
                await Order.findByIdAndUpdate(orderId, updateData);

                // Cập nhật trạng thái giỏ hàng
                if (rspCode === '00') {
                    await Cart.findOneAndUpdate({ userId: order.userId, isPaid: false }, { isPaid: true });
                }
    
                return res.status(200).json({RspCode: '00', Message: 'Success'});
    
            } else {
                console.log('Invalid signature:', {
                    received: secureHash,
                    calculated: signed
                });
                return res.status(200).json({RspCode: '97', Message: 'Invalid signature'});
            }
    
        } catch (error) {
            console.error('VNPay IPN Error:', error);
            return res.status(200).json({RspCode: '99', Message: 'Internal error'});
        }
    }

    // Hoàn tiền
    // refund(req, res) {
    //     process.env.TZ = 'Asia/Ho_Chi_Minh';
    //     const date = new Date();
        
    //     const {
    //         orderId: vnp_TxnRef,
    //         transDate: vnp_TransactionDate,
    //         amount,
    //         transType: vnp_TransactionType,
    //         user: vnp_CreateBy
    //     } = req.body;

    //     const vnp_Amount = amount * 100;
    //     const vnp_RequestId = moment(date).format('HHmmss');
    //     const vnp_Version = '2.1.0';
    //     const vnp_Command = 'refund';
    //     const vnp_OrderInfo = 'Hoan tien GD ma:' + vnp_TxnRef;
    //     const vnp_IpAddr = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    //     const vnp_CreateDate = moment(date).format('YYYYMMDDHHmmss');
    //     const vnp_TransactionNo = '0';

    //     const data = `${vnp_RequestId}|${vnp_Version}|${vnp_Command}|${vnpayConfig.vnp_TmnCode}|${vnp_TransactionType}|${vnp_TxnRef}|${vnp_Amount}|${vnp_TransactionNo}|${vnp_TransactionDate}|${vnp_CreateBy}|${vnp_CreateDate}|${vnp_IpAddr}|${vnp_OrderInfo}`;
    //     const hmac = crypto.createHmac("sha512", vnpayConfig.vnp_HashSecret);
    //     const vnp_SecureHash = hmac.update(new Buffer(data, 'utf-8')).digest("hex");

    //     const dataObj = {
    //         vnp_RequestId, vnp_Version, vnp_Command,
    //         vnp_TmnCode: vnpayConfig.vnp_TmnCode,
    //         vnp_TransactionType, vnp_TxnRef, vnp_Amount,
    //         vnp_TransactionNo, vnp_CreateBy, vnp_OrderInfo,
    //         vnp_TransactionDate, vnp_CreateDate, vnp_IpAddr,
    //         vnp_SecureHash
    //     };

    //     request({
    //         url: vnpayConfig.vnp_Api,
    //         method: "POST",
    //         json: true,
    //         body: dataObj
    //     }, function (error, response, body) {
    //         res.json(body || error);
    //     });
    // }
}

module.exports = new PaymentController();