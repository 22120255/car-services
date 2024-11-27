const navigateUser = (req, res, next) => {
    res.locals.user = req.user || null

    next()
}
const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next()
    }
    res.redirect('/auth/login')
}
const checkRole = (nameRoles) => {
    return async (req, res, next) => {
        console.log(req.user)
        if (nameRoles.some((name) => req.user.role === name)) {
            return next()
        }
        res.redirect('/auth/login')
    }
}

module.exports = {
    navigateUser,
    isAuthenticated,
    checkRole,
}
