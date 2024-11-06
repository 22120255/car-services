class AuthController {
    login(req, res) {
        res.render('auth/login', {
            layout: 'auth',
        })
    }

    register(req, res) {
        res.render('auth/register', {
            layout: 'auth',
        })
    }

    forgotPassword(req, res) {
        res.render('auth/forgot-password', {
            layout: 'auth',
        })
    }
}

module.exports = new AuthController()
