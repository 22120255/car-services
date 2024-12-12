const moment = require('moment');
const crypto = require("crypto");
const request = require('request');
const qs = require('qs');
const vnpayConfig = require('../config/vnpay');


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
        res.render('payment/order', {
            layout: 'payment',
            title: 'Thanh toán',
            amount: 10000
        });
    }

    // Hiển thị form hoàn tiền
    getRefund(req, res) {
        res.render('payment/refund', {
            layout: 'payment',
            title: 'Hoàn tiền giao dịch thanh toán'
        });
    }

    // Xử lý tạo URL thanh toán
    createPayment(req, res) {
        process.env.TZ = 'Asia/Ho_Chi_Minh';
        
        const date = new Date();
        const createDate = moment(date).format('YYYYMMDDHHmmss');
        const orderId = moment(date).format('DDHHmmss');
        
        const ipAddr = req.headers['x-forwarded-for'] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            req.connection.socket.remoteAddress;

        const { amount, bankCode, language = 'vn' } = req.body;
        
        let vnp_Params = {
            vnp_Version: '2.1.0',
            vnp_Command: 'pay',
            vnp_TmnCode: vnpayConfig.vnp_TmnCode,
            vnp_Locale: language,
            vnp_CurrCode: 'VND',
            vnp_TxnRef: orderId,
            vnp_OrderInfo: 'Thanh toan cho ma GD:' + orderId,
            vnp_OrderType: 'other',
            vnp_Amount: amount * 100,
            vnp_ReturnUrl: vnpayConfig.vnp_ReturnUrl,
            vnp_IpAddr: ipAddr,
            vnp_CreateDate: createDate
        };

        if(bankCode) {
            vnp_Params['vnp_BankCode'] = bankCode;
        }

        vnp_Params = sortObject(vnp_Params);

        const signData = qs.stringify(vnp_Params, { encode: false });
        const hmac = crypto.createHmac("sha512", vnpayConfig.vnp_HashSecret);
        const signed = hmac.update(new Buffer(signData, 'utf-8')).digest("hex"); 
        
        vnp_Params['vnp_SecureHash'] = signed;
        const vnpUrl = vnpayConfig.vnp_Url + '?' + qs.stringify(vnp_Params, { encode: false });

        res.redirect(vnpUrl);
    }

    // Xử lý kết quả trả về
    vnpayReturn(req, res) {
        let vnp_Params = req.query;

        let secureHash = vnp_Params['vnp_SecureHash'];

        delete vnp_Params['vnp_SecureHash'];
        delete vnp_Params['vnp_SecureHashType'];

        vnp_Params = sortObject(vnp_Params);

        let tmnCode = vnpayConfig.vnp_TmnCode;
        let secretKey = vnpayConfig.vnp_HashSecret;

        let signData = querystring.stringify(vnp_Params, { encode: false });    
        let hmac = crypto.createHmac("sha512", secretKey);
        let signed = hmac.update(new Buffer(signData, 'utf-8')).digest("hex");    
        console.log('signed', signed);
        console.log('secureHash', secureHash); 

        if(secureHash === signed){
            //Kiem tra xem du lieu trong db co hop le hay khong va thong bao ket qua

            res.render('payment/success', {code: vnp_Params['vnp_ResponseCode']})
        } else{
            res.render('payment/success', {code: '97'})
        }
    }

    // IPN URL
    vnpayIPN(req, res) {
        const vnp_Params = req.query;
        const secureHash = vnp_Params['vnp_SecureHash'];
        const orderId = vnp_Params['vnp_TxnRef'];
        const rspCode = vnp_Params['vnp_ResponseCode'];

        delete vnp_Params['vnp_SecureHash'];
        delete vnp_Params['vnp_SecureHashType'];

        const sortedParams = sortObject(vnp_Params);
        const signData = qs.stringify(sortedParams, { encode: false });
        const hmac = crypto.createHmac("sha512", vnpayConfig.vnp_HashSecret);
        const signed = hmac.update(new Buffer(signData, 'utf-8')).digest("hex");

        const paymentStatus = '0';
        const checkOrderId = true;
        const checkAmount = true;

        if(secureHash === signed) {
            if(checkOrderId) {
                if(checkAmount) {
                    if(paymentStatus == "0") {
                        if(rspCode == "00") {
                            res.status(200).json({RspCode: '00', Message: 'Success'});
                        } else {
                            res.status(200).json({RspCode: '00', Message: 'Success'});
                        }
                    } else {
                        res.status(200).json({RspCode: '02', Message: 'Order already confirmed'});
                    }
                } else {
                    res.status(200).json({RspCode: '04', Message: 'Invalid amount'});
                }
            } else {
                res.status(200).json({RspCode: '01', Message: 'Order not found'});
            }
        } else {
            res.status(200).json({RspCode: '97', Message: 'Invalid signature'});
        }
    }

    // Truy vấn giao dịch
    queryTransaction(req, res) {
        process.env.TZ = 'Asia/Ho_Chi_Minh';
        const date = new Date();
        const vnp_RequestId = moment(date).format('HHmmss');
        const vnp_Version = '2.1.0';
        const vnp_Command = 'querydr';
        const vnp_TxnRef = req.body.orderId;
        const vnp_TransactionDate = req.body.transDate;
        const vnp_CreateDate = moment(date).format('YYYYMMDDHHmmss');
        const vnp_IpAddr = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        const vnp_OrderInfo = 'Truy van GD ma:' + vnp_TxnRef;

        const data = `${vnp_RequestId}|${vnp_Version}|${vnp_Command}|${vnpayConfig.vnp_TmnCode}|${vnp_TxnRef}|${vnp_TransactionDate}|${vnp_CreateDate}|${vnp_IpAddr}|${vnp_OrderInfo}`;
        const hmac = crypto.createHmac("sha512", vnpayConfig.vnp_HashSecret);
        const vnp_SecureHash = hmac.update(new Buffer(data, 'utf-8')).digest("hex");

        const dataObj = {
            vnp_RequestId, vnp_Version, vnp_Command, 
            vnp_TmnCode: vnpayConfig.vnp_TmnCode,
            vnp_TxnRef, vnp_OrderInfo, vnp_TransactionDate,
            vnp_CreateDate, vnp_IpAddr, vnp_SecureHash
        };

        request({
            url: vnpayConfig.vnp_Api,
            method: "POST",
            json: true,
            body: dataObj
        }, function (error, response, body) {
            res.json(body || error);
        });
    }

    // Hoàn tiền
    refund(req, res) {
        process.env.TZ = 'Asia/Ho_Chi_Minh';
        const date = new Date();
        
        const {
            orderId: vnp_TxnRef,
            transDate: vnp_TransactionDate,
            amount,
            transType: vnp_TransactionType,
            user: vnp_CreateBy
        } = req.body;

        const vnp_Amount = amount * 100;
        const vnp_RequestId = moment(date).format('HHmmss');
        const vnp_Version = '2.1.0';
        const vnp_Command = 'refund';
        const vnp_OrderInfo = 'Hoan tien GD ma:' + vnp_TxnRef;
        const vnp_IpAddr = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        const vnp_CreateDate = moment(date).format('YYYYMMDDHHmmss');
        const vnp_TransactionNo = '0';

        const data = `${vnp_RequestId}|${vnp_Version}|${vnp_Command}|${vnpayConfig.vnp_TmnCode}|${vnp_TransactionType}|${vnp_TxnRef}|${vnp_Amount}|${vnp_TransactionNo}|${vnp_TransactionDate}|${vnp_CreateBy}|${vnp_CreateDate}|${vnp_IpAddr}|${vnp_OrderInfo}`;
        const hmac = crypto.createHmac("sha512", vnpayConfig.vnp_HashSecret);
        const vnp_SecureHash = hmac.update(new Buffer(data, 'utf-8')).digest("hex");

        const dataObj = {
            vnp_RequestId, vnp_Version, vnp_Command,
            vnp_TmnCode: vnpayConfig.vnp_TmnCode,
            vnp_TransactionType, vnp_TxnRef, vnp_Amount,
            vnp_TransactionNo, vnp_CreateBy, vnp_OrderInfo,
            vnp_TransactionDate, vnp_CreateDate, vnp_IpAddr,
            vnp_SecureHash
        };

        request({
            url: vnpayConfig.vnp_Api,
            method: "POST",
            json: true,
            body: dataObj
        }, function (error, response, body) {
            res.json(body || error);
        });
    }
}

module.exports = new PaymentController();