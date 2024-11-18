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
    json(context) {
        return JSON.stringify(context);
    },
    formatDate(date) {
        if (!date) return '';
        const options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        return new Date(date).toLocaleDateString('vi-VN', options);
    },
    isUser(role) {
        return role === 'user';
    },
    isAdmin(role) {
        return role === 'admin';
    },
    isSuperAdmin(role) {
        return role === 'sadmin';
    }
}