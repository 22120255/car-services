// config/vnpayConfig.js
let config = {
    vnp_TmnCode: process.env.VNP_TMNCODE,
    vnp_HashSecret: process.env.VNP_HASHSECRET,
    vnp_Url: process.env.VNP_URL,
    vnp_ReturnUrl: process.env.VNP_RETURN_URL,
    vnp_IpnUrl: process.env.VNP_IPN_URL 
};

function updateIpnUrl(newUrl) {
    config.vnp_IpnUrl = newUrl;
}

module.exports = {
    getConfig: () => config,
    updateIpnUrl
};