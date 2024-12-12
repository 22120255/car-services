require('dotenv').config();

module.exports = {
    vnp_TmnCode: process.env.VNP_TMNCODE, // Mã website của bạn
    vnp_HashSecret: process.env.VNP_HASHSECRET, // Chuỗi mã hóa bí mật
    vnp_Url: process.env.VNP_URL, // URL cổng thanh toán
    vnp_ReturnUrl: process.env.VNP_RETURN_URL // URL trả về sau thanh toán
};
