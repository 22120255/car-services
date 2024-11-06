module.exports = function login(req, res, next) {
    res.locals.user = null;

    if (req.session.user) {
        res.locals.user = req.session.user;
    }

    next();
};
