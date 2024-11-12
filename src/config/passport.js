const passport = require('passport');
const bcrypt = require('bcrypt');

const User = require('../models/User');
const LocalStrategy = require('passport-local').Strategy;

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    const user = await User.findById(id);
    done(null, user);
});

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
},
    async function (email, password, done) {
        try {
            const user = await User.findOne({ email }).select('+password');

            if (!user) {
                return done(null, false, { message: 'Email chưa được đăng kí' });
            }
            const isPasswordMatched = await bcrypt.compare(password, user.password);

            if (!isPasswordMatched) {
                return done(null, false, { message: 'Mật khẩu không đúng' });
            }
            return done(null, user);
        } catch (error) {
            return done(null, false, { message: 'Có lỗi, vui lòng thử lại sau!' });
        }
    }
));

module.exports = passport;
