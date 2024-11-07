module.exports = {
    eq(a, b) {
        return a === b;
    },
    hasUser(user) {
        return user && user.email;
    },
}