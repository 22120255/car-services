// services/AuthService.js
const User = require("../models/User");
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const saltRounds = 10;

class AuthService {
    async verifyEmail(email, password) {
        try {
            const user = await User
                .findOne({ email })
                .select('+passwordHashed');

            if (!user) {
                const error = new Error("Email chưa được đăng kí");
                error.statusCode = 401;
                throw error;
            }

            const isPasswordMatched = await bcrypt.compare(password, user.passwordHashed);

            if (!isPasswordMatched) {
                const error = new Error("Mật khẩu không chính xác");
                error.statusCode = 401;
                throw error;
            }

            if (!user.isActivated) {
                const error = new Error("Tài khoản chưa được kích hoạt, vui lòng kiểm tra email để kích hoạt tài khoản");
                error.statusCode = 403;
                throw error;
            }

            return user;
        } catch (err) {
            if (!err.statusCode) {
                err.statusCode = 500; // Internal Server Error for unknown errors
                err.message = "Có lỗi khi xác thực email";
            }
            throw err;
        }
    }


    async checkEmailAvailability(email) {
        try {
            const userExists = await User.findOne({ email });
            return !userExists;  // Trả về true nếu email chưa tồn tại
        } catch (err) {
            throw new Error("Lỗi khi kiểm tra email.");
        }
    }

    async storeUserWithEmail(email, fullName, password) {
        try {
            const activationToken = crypto.randomBytes(20).toString('hex');
            const passwordHashed = await bcrypt.hash(password, saltRounds);
            const user = new User({ email, fullName, activationToken, passwordHashed });

            const transporter = nodemailer.createTransport({
                service: 'Gmail',
                auth: {
                    user: process.env.EMAIL,
                    pass: process.env.PASSWORD
                }
            });

            const activationLink = `${process.env.DOMAIN_URL}/auth/activate?token=${activationToken}`;
            await transporter.sendMail({
                from: 'no-reply@car-service.com',
                to: email,
                subject: 'Kích hoạt tài khoản',
                text: `Xin chào ${fullName}, vui lòng kích hoạt tài khoản của bạn bằng cách nhấn vào liên kết sau: ${activationLink}`
            });

            return user;
        } catch (err) {
            throw new Error("Có lỗi khi lưu thông tin người dùng.");
        }
    }

    async activateAccountByToken(token) {
        try {
            const user = await User.findOne({ activationToken: token });

            if (!user) {
                throw new Error("Token không hợp lệ.");
            }

            user.isActivated = true;
            user.activationToken = undefined;
            await user.save();

            return user;
        } catch (err) {
            throw new Error("Có lỗi xảy ra khi kích hoạt tài khoản.");
        }
    }

    async registerWithSocialAccount(email, fullName, avatar) {
        try {
            let user = await User.findOne({ email });

            if (!user) {
                user = new User({
                    email,
                    fullName,
                    avatar,
                    isActivated: true
                });
                await user.save();
                return user;
            }

            return user; // Nếu người dùng đã tồn tại
        } catch (error) {
            throw new Error("Lỗi khi đăng ký với tài khoản mạng xã hội.");
        }
    }
}

module.exports = new AuthService();
