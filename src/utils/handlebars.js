const moment = require('moment');

module.exports = {
  eq(a, b) {
    return a === b;
  },
  hasUser(user) {
    return user && user.email;
  },
  gt(a, b) {
    return a > b;
  },
  lt(a, b) {
    return a < b;
  },
  inc(value) {
    return value + 1;
  },
  dec(value) {
    return value - 1;
  },
  and(a, b) {
    return a & b;
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
      minute: '2-digit',
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
  },
  getValueAt(array, index) {
    if (!array || index < 0 || index >= array.length || !Array.isArray(array)) return '';
    return array[index];
  },

  formatNumber: function (number) {
    return number.toLocaleString('vi-VN');
  },

  formatCurrency: function (number) {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'USD',
    }).format(number);
  },

  formatDate: function (date) {
    return moment(date).format('DD/MM/YYYY HH:mm');
  },
};
