const Role = require('../models/Role');

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
const checkRole = (nameRoles) => {
    return async (req, res, next) => {
        const roles = await Promise.all(
            nameRoles.map(name => Role.findOne({ name }))
        );

        const hasRole = roles.some(role => req.user.role === role._id);

        if (hasRole) {
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