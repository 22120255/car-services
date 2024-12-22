const moment = require('moment')
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
  formatDate(date) {
    if (!date) return ''
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }
    return new Date(date).toLocaleDateString('vi-VN', options)
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


  roundUp: function (value) {
    return (Math.ceil(value * 10) / 10).toFixed(1);
  },
};

  formatNumber: (number, shorten = false) => Formatter.formatNumber(number, options = { shorten: shorten }),
  formatCurrency: Formatter.formatCurrency,
  formatDate: (value) => Formatter.formatDate(value),
}

