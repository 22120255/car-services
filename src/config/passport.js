const passport = require('passport')
const bcrypt = require('bcrypt')

const User = require('../models/User')
const LocalStrategy = require('passport-local').Strategy

passport.serializeUser(function (user, done) {
    done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
    const user = await User.findById(id);
    done(null, user.toJSON());
});

passport.use(
    new LocalStrategy(
        {
            usernameField: 'email',
            passwordField: 'password',
        },
        async function (email, password, done) {
            try {
                const user = await User.findOne({ email }).select('+password')

                if (!user) {
                    return done(null, false, {
                        message: 'Email not registered',
                    })
                }
                const isPasswordMatched = await user.comparePassword(password)

                if (!isPasswordMatched) {
                    return done(null, false, { message: 'Incorrect password' })
                }
                return done(null, user)
            } catch (error) {
                return done(null, false, {
                    message: 'An error occurred, please try again later!',
                })
            }
        }
    )
)

module.exports = passport
