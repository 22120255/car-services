// controllers/AuthController.js
const AuthService = require('../services/AuthService')
const passport = require('passport')
const User = require('../models/User')
const redisClient = require('../config/redis')
const { errorLog } = require('../utils/customLog')
const { clearCache } = require('../utils/helperCache')
class AuthController {
    //[GET] /login
    login(req, res) {
        res.render('auth/login', {
            layout: 'auth',
            message: req.flash('error') || '',
            title: 'Đăng nhập'
        })
    }

    //[POST] /login/email/verify
    async verifyEmail(req, res, next) {
        passport.authenticate('local', async (err, user, info) => {
            if (err) {
                return next(err);
            }

            if (!user) {
                return res.status(400).json({ message: 'Đăng nhập thất bại' });
            }

            // Check if the user's account is verified
            if (user.verificationCode) {
                return res.status(401).json({ message: 'Tài khoản chưa được xác thực. Vui lòng kiểm tra email để tiến hành xác thực' });
            }

            // Explicitly log in the user
            req.logIn(user, (err) => {
                if (err) {
                    return next(err);
                }
                // Clear cache before redirecting
                clearCache('/dashboard')

                // Thay vì redirect, trả về một chỉ thị
                res.status(200).json({ redirect: '/dashboard' });
            });
        })(req, res, next);
    }

    //[GET] /register
    register(req, res) {
        res.render('auth/register', {
            layout: 'auth',
            title: 'Đăng kí'
        })
    }

    //[GET] /check-email
    async checkEmail(req, res) {
        try {
            const { email } = req.query
            const isAvailable = await AuthService.checkEmailAvailability(email)
            res.status(200).json({ isAvailable })
        } catch (err) {
            res.status(400).json({ error: err.message })
        }
    }

    //[POST] /register/email/store
    async storeEmail(req, res) {
        const { email, fullName, password } = req.body

        try {
            const user = await AuthService.storeUserWithEmail(
                email,
                fullName,
                password
            )
            res.status(200).json({ message: "Đăng ký thành công! Vui lòng kiểm tra email để kích hoạt tài khoản." });
        } catch (err) {
            res.status(400).json({ error: err.message })
        }
    }

    //[GET] /activate
    async activateAccount(req, res) {
        const { token } = req.query

        try {
            const user = await AuthService.activateAccountByToken(token);
            res.render('auth/activate-account', {
                layout: 'auth',
                error: false,
                message: "Tài khoản của bạn đã được kích hoạt thành công! Vui lòng đăng nhập vào tài khoản để sử dụng.",
                title: 'Kích hoạt tài khoản'
            })
        } catch (err) {
            res.render('auth/activate-account', {
                layout: 'auth',
                error: true,
                message:
                    'Không thể kích hoạt tài khoản. Token không hợp lệ hoặc đã hết hạn.',
                title: 'Kích hoạt tài khoản'
            })
        }
    }

    //[GET] /auth/register/google/store
    async registerWithGoogle(req, res) {
        const { email, fullName, avatar } = req.body

        try {
            const user = await AuthService.registerWithSocialAccount(
                email,
                fullName,
                avatar
            )

            req.login(user, (err) => {
                if (err) {
                    return res
                        .status(500)
                        .json({ error: 'Đăng nhập tự động thất bại.' })
                }
                // Clear cache before redirecting
                clearCache('/dashboard')

                // Thay vì redirect, trả về một chỉ thị
                res.status(200).json({ redirect: '/dashboard' });
            })
        } catch (error) {
            res.status(500).json({ message: 'Lỗi server' })
        }
    }

    //[GET] /auth/register/facebook/store
    async registerWithFacebook(req, res) {
        const { email, fullName, avatar } = req.body

        try {
            const user = await AuthService.registerWithSocialAccount(
                email,
                fullName,
                avatar
            )

            req.login(user, (err) => {
                if (err) {
                    return res
                        .status(500)
                        .json({ error: 'Đăng nhập tự động thất bại.' })
                }
                // Clear cache before redirecting
                clearCache('/dashboard')

                // Thay vì redirect, trả về một chỉ thị
                res.status(200).json({ redirect: '/dashboard' });
            })
        } catch (error) {
            res.status(500).json({ message: 'Lỗi server' })
        }
    }

    forgotPassword(req, res) {
        res.render('auth/forgot-password', {
            layout: 'auth',
            title: 'Quên mật khẩu'
        })
    }

    async sendVerificationCode(req, res) {
        const { email } = req.body

        try {
            await AuthService.sendVerificationCode(email)
            res.status(200).json({
                message: 'Mã xác thực đã được gửi đến email của bạn',
            })
        } catch (err) {
            res.status(404).json({ error: err.message })
        }
    }

    async resetPassword(req, res) {
        const { email, verificationCode, password } = req.body

        try {
            await AuthService.resetPassword(email, verificationCode, password)
            res.status(200).json({ message: 'Mật khẩu đã được thay đổi.' })
        } catch (err) {
            res.status(400).json({ error: err.message })
        }
    }

    // [GET] /auth/logout
    async logout(req, res, next) {
        try {
            await User.findByIdAndUpdate(req.user.id, {
                lastLogin: Date.now(),
            })
            req.logout(function (err) {
                if (err) {
                    res.redirect('/dashboard')
                }
                // Clear cache before redirecting
                clearCache('/dashboard')
                res.redirect('/dashboard')
            })
        } catch (err) {
            console.log(err)
            res.redirect('/dashboard')
        }
    }
}

module.exports = new AuthController()
