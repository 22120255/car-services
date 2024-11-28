const nodemailer = require('nodemailer');

async function sendEmail(to, subject, message) {
    try {
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD
            }
        });

        await transporter.sendMail({
            from: 'no-reply@car-service.com',
            to, 
            subject,
            text: message
        });
    } catch (err) {
        throw new Error("Có lỗi khi gửi mã xác thực");
    }
}

module.exports = { sendEmail };