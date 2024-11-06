const User = require("../models/User");
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const saltRounds = 10;

class AuthController {
    //[GET] /login
    login(req, res) {
        res.render("auth/login", {
            layout: "auth",
        });
    }

    //[GET] /register
    register(req, res) {
        res.render("auth/register", {
            layout: "auth",
        });
    }

    //[GET] /check-email
    async checkEmail(req, res) {
        try {
            const { email } = req.query;

            const userExists = await User.findOne({ email });
            res.status(200).json({ isAvailable: !userExists });
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    }

    //[POST] /register/email/store
    async storeEmail(req, res) {
        const { email, fullName, password } = req.body;

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

            await user.save();

            res.status(200).json({ message: "Đăng ký thành công! Vui lòng kiểm tra email để kích hoạt tài khoản." });
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    }

    //[GET] /activate
    async activateAccount(req, res) {
        const { token } = req.query;

        try {
            const user = await User.findOne({ activationToken: token });

            if (!user) {
                return res.status(400).json({ error: "Token không hợp lệ." });
            }

            user.isActivated = true;
            user.activationToken = undefined;
            await user.save();

            res.status(200).json({ message: "Tài khoản của bạn đã được kích hoạt thành công!" });
        } catch (err) {
            res.status(500).json({ error: "Có lỗi xảy ra, vui lòng thử lại." });
        }
    };

    //[GET] /auth/register/facebook/store
    async registerWithGoogle(req, res) {
        const { email, fullName, avatar } = req.body;

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
                return res.status(201).json({ message: "User registered successfully", user });
            }

            res.status(200).json({ message: "User already exists", user });
        } catch (error) {
            console.error("Error registering user:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    }

    //[GET] /auth/register/facebook/store
    async registerWithFacebook(req, res) {
        const { email, fullName, avatar } = req.body;

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
                return res.status(201).json({ message: "User registered successfully", user });
            }

            res.status(200).json({ message: "User already exists", user });
        } catch (error) {
            console.error("Error registering user:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    }

    forgotPassword(req, res) {
        res.render("auth/forgot-password", {
            layout: "auth",
        });
    }
}

module.exports = new AuthController();