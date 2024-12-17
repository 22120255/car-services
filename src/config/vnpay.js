// config/vnpayConfig.js
let config = {
    vnp_TmnCode: process.env.VNP_TMNCODE,
    vnp_HashSecret: process.env.VNP_HASHSECRET,
    vnp_Url: process.env.VNP_URL,
    vnp_ReturnUrl: process.env.VNP_RETURN_URL,
    vnp_IpnUrl: "https://car-services-61gu.onrender.com/api/payment/vnpay_ipn"
};

function updateIpnUrl(newUrl) {
    config.vnp_IpnUrl = newUrl;
}

module.exports = {
    getConfig: () => config,
    updateIpnUrl
};