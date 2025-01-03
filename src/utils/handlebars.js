const Formatter = require('./formatter')

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
    return a & b
  },
  json(context) {
    return JSON.stringify(context)
  },
  isUser(role) {
    return role === 'user'
  },
  isAdmin(role) {
    return role === 'admin'
  },
  isSuperAdmin(role) {
    return role === 'sadmin'
  },
  getValueAt(array, index) {
    if (!array || index < 0 || index >= array.length || !Array.isArray(array)) return ''
    return array[index]
  },
  formatNumber: (number, shorten = false) => Formatter.formatNumber(number, { shorten: shorten }),
  formatCurrency: Formatter.formatCurrency,
  formatDate: (value) => Formatter.formatDate(value),
  roundUp: function (value) {
    return (Math.ceil(value * 10) / 10).toFixed(1);
  },
}
