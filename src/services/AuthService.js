// services/AuthService.js
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const { sendEmail } = require("../utils/sendEmail");
const CustomError = require("../models/CustomError");

class AuthService {
  async checkEmailAvailability(email) {
    try {
      const userExists = await User.findOne({ email });
      return !userExists; // Trả về true nếu email chưa tồn tại
    } catch (err) {
      throw new Error('Error checking email.');
    }
  }

  async storeUserWithEmail(email, fullName, password) {
    try {
      const verificationCode = crypto.randomBytes(20).toString('hex');
      const user = new User({ email, fullName, verificationCode, password, avatar: '/images/avatar-default.jpg' });
      const activationLink = `${process.env.DOMAIN_URL}/auth/activate?token=${verificationCode}`;

      await sendEmail(
        email,
        'Activate account',
        `Hello ${fullName}, please activate your account by clicking the following link.: ${activationLink}`
      );
      await user.save();

      return user;
    } catch (err) {
      throw new Error('There was an error saving user information.');
    }
  }

  async activateAccountByToken(token) {
    try {
      const user = await User.findOne({ verificationCode: token });

      if (!user) {
        throw new Error('Invalid Token.');
      }

      user.status = 'active';
      user.verificationCode = undefined;
      await user.save();

      return user;
    } catch (err) {
      throw new Error('An error occurred while activating your account.');
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
          status: 'active',
        });
        await user.save();
        return user;
      }

      return user; // Nếu người dùng đã tồn tại
    } catch (error) {
      throw new Error('Error registering with social network account.');
    }
  }

  async sendVerificationCode(email) {
    try {
      const user = await User.findOne({ email });
      if (!user) {
        throw new Error('Email not registered account');
      }

      const verificationCode = Math.floor(100000 + Math.random() * 900000);
      user.verificationCode = verificationCode;
      await user.save();

      await sendEmail(email, 'Verification code', `Your verification code is: ${verificationCode}`);
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async resetPassword(email, verificationCode, password) {
    try {
      const user = await User.findOne({ email });
      if (!user) {
        throw new Error('Email not registered account');
      }

      if (user.verificationCode !== verificationCode) {
        throw new Error('Incorrect verification code');
      }

      user.password = password;
      user.verificationCode = undefined;
      await user.save();

      await sendEmail(email, 'Change Password', `Your password has been changed.`);
    } catch (err) {
      throw new Error(err.message);
    }
  }
  async changePassword(userId, currentPassword, newPassword) {
    const user = await User.findById(userId).select("+password");
    if (!user) {
      throw new CustomError(404, "User not found.");
    }

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      throw new CustomError(400, "Incorrect password.");
    }

    user.password = newPassword;
    await user.save();

    return user;
  }
}

module.exports = new AuthService();
