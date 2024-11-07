module.exports = (req, res, next) => {
    req.session._garbage = Date();
    req.session.touch();
    next();
}