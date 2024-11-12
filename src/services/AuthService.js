// services/AuthService.js
const User = require("../models/User");
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const { sendEmail } = require("../utils/sendEmail");

class AuthService {
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
            const verificationCode = crypto.randomBytes(20).toString('hex');
            const user = new User({ email, fullName, verificationCode, password });
            const activationLink = `${process.env.DOMAIN_URL}/auth/activate?token=${verificationCode}`;

            await sendEmail(email, "Kích hoạt tài khoản", `Xin chào ${fullName}, vui lòng kích hoạt tài khoản của bạn bằng cách nhấn vào liên kết sau: ${activationLink}`);
            await user.save();

            return user;
        } catch (err) {
            throw new Error("Có lỗi khi lưu thông tin người dùng.");
        }
    }

    async activateAccountByToken(token) {
        try {
            const user = await User.findOne({ verificationCode: token });

            if (!user) {
                throw new Error("Token không hợp lệ.");
            }

            user.isActivated = true;
            user.verificationCode = undefined;
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

    async sendVerificationCode(email) {
        try {
            const user = await User.findOne({ email });
            if (!user) {
                throw new Error("Email chưa đăng kí tài khoản");
            }

            const verificationCode = Math.floor(100000 + Math.random() * 900000);
            user.verificationCode = verificationCode;
            await user.save();

            await sendEmail(email, "Mã xác thực", `Mã xác thực của bạn là: ${verificationCode}`);
        }
        catch (err) {
            throw new Error(err.message);
        }
    }

    async resetPassword(email, verificationCode, password) {
        try {
            const user = await User.findOne({ email });
            if (!user) {
                throw new Error("Email chưa đăng kí tài khoản");
            }

            if (user.verificationCode !== verificationCode) {
                throw new Error("Mã xác thực không đúng");
            }

            user.password = password;
            user.verificationCode = undefined;
            await user.save();

            await sendEmail(email, "Thay đổi mật khẩu", `Mật khẩu của bạn đã được thay đổi.`);
        }
        catch (err) {
            throw new Error(err.message);
        }
    }
}

module.exports = new AuthService();
