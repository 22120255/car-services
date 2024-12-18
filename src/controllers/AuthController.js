// controllers/AuthController.js
const AuthService = require('../services/AuthService');
const passport = require('passport');
const User = require('../models/User');
const { clearCache, clearAllCache } = require('../utils/helperCache');
const { errorLog } = require('../utils/customLog');

class AuthController {
  //[GET] /login
  login(req, res) {
    res.render('auth/login', {
      layout: 'auth',
      message: req.flash('error') || '',
      title: 'Login',
    });
  }

  //[POST] /login/email/verify
  async verifyEmail(req, res, next) {
    passport.authenticate('local', async (err, user, info) => {
      if (err) {
        return next(err);
      }

      if (!user) {
        return res.status(400).json({ message: 'Login failed' });
      }

      // Check if the user's account is verified
      if (user.verificationCode) {
        return res.status(401).json({
          message: 'Account not verified. Please check your email to verify.',
        });
      }

      // Explicitly log in the user
      req.logIn(user, (err) => {
        if (err) {
          return next(err);
        }
        // Clear cache before redirecting
        clearAllCache();

        res.status(200).json("Login successfully");
      });
    })(req, res, next);
  }

  //[GET] /register
  register(req, res) {
    res.render('auth/register', {
      layout: 'auth',
      title: 'Register',
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
      res.status(200).json({
        message: 'Registration successful! Please check your email to activate your account.',
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
      res.render('auth/activate-account', {
        layout: 'auth',
        error: false,
        message: 'Your account has been successfully activated! Please log in to your account to use it.',
        title: 'Activate account',
      });
    } catch (err) {
      res.render('auth/activate-account', {
        layout: 'auth',
        error: true,
        message: 'Unable to activate account. Token is invalid or expired.',
        title: 'Activate account',
      });
    }
  }

  //[GET] /auth/register/google/store
  async registerWithGoogle(req, res) {
    const { email, fullName, avatar } = req.body;

    try {
      const user = await AuthService.registerWithSocialAccount(email, fullName, avatar);

      req.login(user, (err) => {
        if (err) {
          return res.status(500).json({ error: 'Login failed.' });
        }
        // Clear cache before redirecting
        if (req.isAuthenticated())
          clearCache(`dashboard/${req.user._id}`);
        else
          clearCache('dashboard');

        // Thay vì redirect, trả về một chỉ thị
        res.status(200).json({ redirect: '/dashboard' });
      });
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  }

  //[GET] /auth/register/facebook/store
  async registerWithFacebook(req, res) {
    const { email, fullName, avatar } = req.body;

    try {
      const user = await AuthService.registerWithSocialAccount(email, fullName, avatar);

      req.login(user, (err) => {
        if (err) {
          return res.status(500).json({ error: 'Login failed.' });
        }
        // Clear cache before redirecting
        if (req.isAuthenticated())
          clearCache(`dashboard/${req.user._id}`);
        else
          clearCache('dashboard');

        // Thay vì redirect, trả về một chỉ thị
        res.status(200).json({ redirect: '/dashboard' });
      });
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  }

  forgotPassword(req, res) {
    res.render('auth/forgot-password', {
      layout: 'auth',
      title: 'Forgot Password',
    });
  }

  async sendVerificationCode(req, res) {
    const { email } = req.body;

    try {
      await AuthService.sendVerificationCode(email);
      res.status(200).json({
        message: 'A verification code has been sent to your email.',
      });
    } catch (err) {
      res.status(404).json({ error: err.message });
    }
  }

  async resetPassword(req, res) {
    const { email, verificationCode, password } = req.body;

    try {
      await AuthService.resetPassword(email, verificationCode, password);
      res.status(200).json({ message: 'Password has been changed.' });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  async changePassword(req, res) {
    const { currentPassword, newPassword } = req.body;

    try {
      await AuthService.changePassword(req.user._id, currentPassword, newPassword);
      res.status(200).json({ message: 'Password has been changed.' });
    } catch (err) {
      res.status(err.statusCode || 400).json({ error: err.message });
    }
  }

  // [GET] /auth/logout
  async logout(req, res, next) {
    try {
      await User.findByIdAndUpdate(req.user._id, {
        lastLogin: Date.now(),
      });
      req.logout(function (err) {
        if (err) {
          res.redirect('/dashboard');
        }
        // Clear cache before redirecting
        clearAllCache();
        res.redirect('/dashboard');
      });
    } catch (err) {
      errorLog('AuthController', 'logout', err);
      res.redirect('/dashboard');
    }
  }
}

module.exports = new AuthController();
