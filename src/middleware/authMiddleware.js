const navigateUser = (req, res, next) => {
    res.locals.user = req.user || null;

    next();
};
const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/auth/login');
}
const checkRole = (role) => {
    return (req, res, next) => {
        if (req.user.role === role) {
            return next();
        }
        res.redirect('/auth/login');
    }
}

module.exports = {
    navigateUser,
    isAuthenticated,
    checkRole
}