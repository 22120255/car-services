const passport = require('passport');
const bcrypt = require('bcryptjs');

const User = require('../models/User');
const LocalStrategy = require('passport-local').Strategy;

passport.serializeUser(function (user, done) {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    if (!user) {
      // Nếu không tìm thấy user, trả về lỗi để thoát phiên đăng nhập
      return done(null, false, { message: 'Session invalid, user not found' });
    }
    done(null, user.toJSON());
  } catch (err) {
    done(err, null);
  }
});

passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
    },
    async function (email, password, done) {
      try {
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
          return done(null, false, {
            message: 'Email not registered',
          });
        }
        const isPasswordMatched = await user.comparePassword(password);

        if (!isPasswordMatched) {
          return done(null, false, { message: 'Incorrect password' });
        }
        return done(null, user);
      } catch (error) {
        return done(null, false, {
          message: 'An error occurred, please try again later.!',
        });
      }
    }
  )
);

module.exports = passport;
