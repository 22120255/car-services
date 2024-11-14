module.exports = {
    eq(a, b) {
        return a === b
    },
    hasUser(user) {
        return user && user.email
    },
    gt(a, b) {
        return a > b
    },
    lt(a, b) {
        return a < b
    },
    inc(value) {
        return value + 1
    },
    dec(value) {
        return value - 1
    },
    and(a, b) {
        return a && b
    },
}
