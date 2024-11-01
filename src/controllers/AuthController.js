class AuthController {
    login(req, res) {
        res.render("auth/login");
    }

    register(req, res) {
        res.render("auth/register");
    }

    forgotPassword(req, res) {
        res.render("auth/forgot-password");
    }
}

module.exports = new AuthController();