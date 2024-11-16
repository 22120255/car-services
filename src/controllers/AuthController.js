// controllers/AuthController.js
const AuthService = require('../services/AuthService');
const passport = require('passport');
const User = require('../models/User')

class AuthController {
    //[GET] /login
    login(req, res) {
        res.render("auth/login", {
            layout: "auth",
            message: req.flash("error") || "",
        });
    }

    //[POST] /login/email/verify]
    async verifyEmail(req, res, next) {
        passport.authenticate('local', {
            successReturnToOrRedirect: '/dashboard',
            failureRedirect: '/auth/login',
            failureFlash: true
        })(req, res, next);
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
            const isAvailable = await AuthService.checkEmailAvailability(email);
            res.status(200).json({ isAvailable });
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    }

    //[POST] /register/email/store
    async storeEmail(req, res) {
        const { email, fullName, password } = req.body;

        try {
            const user = await AuthService.storeUserWithEmail(email, fullName, password);

            req.login(user, (err) => {
                if (err) {
                    return res.status(500).json({ error: 'Đăng nhập tự động thất bại.' });
                }
                res.status(200).json({ message: "Đăng ký thành công! Vui lòng kiểm tra email để kích hoạt tài khoản." });
            });
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    }

    //[GET] /activate
    async activateAccount(req, res) {
        const { token } = req.query;

        try {
            const user = await AuthService.activateAccountByToken(token);
            res.status(200).json({ message: "Tài khoản của bạn đã được kích hoạt thành công!" });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    //[GET] /auth/register/google/store
    async registerWithGoogle(req, res) {
        const { email, fullName, avatar } = req.body;

        try {
            const user = await AuthService.registerWithSocialAccount(email, fullName, avatar);

            req.login(user, (err) => {
                if (err) {
                    return res.status(500).json({ error: 'Đăng nhập tự động thất bại.' });
                }
                res.status(200).json({ message: user ? "Tài khoản đã tồn tại" : "Đăng kí thành công", user });
            });
        } catch (error) {
            res.status(500).json({ message: "Lỗi server" });
        }
    }

    //[GET] /auth/register/facebook/store
    async registerWithFacebook(req, res) {
        const { email, fullName, avatar } = req.body;

        try {
            const user = await AuthService.registerWithSocialAccount(email, fullName, avatar);

            req.login(user, (err) => {
                if (err) {
                    return res.status(500).json({ error: 'Đăng nhập tự động thất bại.' });
                }
                res.status(200).json({ message: user ? "Tài khoản đã tồn tại" : "Đăng kí thành công", user });
            });
        } catch (error) {
            res.status(500).json({ message: "Lỗi server" });
        }
    }

    forgotPassword(req, res) {
        res.render("auth/forgot-password", {
            layout: "auth",
        });
    }

    async sendVerificationCode(req, res) {
        const { email } = req.body;

        try {
            await AuthService.sendVerificationCode(email);
            res.status(200).json({ message: "Mã xác thực đã được gửi đến email của bạn" });
        } catch (err) {
            res.status(404).json({ error: err.message });
        }
    }

    async resetPassword(req, res) {
        const { email, verificationCode, password } = req.body;

        try {
            await AuthService.resetPassword(email, verificationCode, password);
            res.status(200).json({ message: "Mật khẩu đã được thay đổi." });
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    }

    // [GET] /auth/logout
    async logout(req, res, next) {
        try {
            await User.findByIdAndUpdate(req.user._id, { lastLogin: Date.now() });
            req.logout(function (err) {
                if (err) {
                    return next(err);
                    res.redirect('/dashboard');
                }
                res.redirect('/dashboard');
            });
        } catch (err) {
            console.log(err);
            res.redirect('/dashboard');
        }
    }
}

module.exports = new AuthController();