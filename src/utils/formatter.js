class Formatter {
    static formatNumber(value, options = { decimal: 2, shorten: true, locale: 'vi-VN' }) {
        const formattedValue = value.toLocaleString(options.locale);
        console.log('formattedValue', formattedValue);
        console.log('shorten', options.shorten);

        if (!options.shorten) {
            return formattedValue;
        }

        if (value < 1_000) {
            return formattedValue;
        } else if (value >= 1_000 && value < 1_000_000) {
            return (value / 1_000).toFixed(options.decimal) + 'K';
        } else if (value >= 1_000_000 && value < 1_000_000_000) {
            return (value / 1_000_000).toFixed(options.decimal) + 'M';
        } else {
            return (value / 1_000_000_000).toFixed(options.decimal) + 'B';
        }
    }

    static formatCurrency(value, currency = 'VND') {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency,
        }).format(value);
    }

    static formatDate(date) {
        return new Date(date).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    }

    static capitalize(text) {
        return text.charAt(0).toUpperCase() + text.slice(1);
    }

    static formatPercentage(value, decimal = 2) {
        return (value * 100).toFixed(decimal) + '%';
    }

    static maskString(str, visibleDigits = 4) {
        return str.slice(0, -visibleDigits).replace(/./g, '*') + str.slice(-visibleDigits);
    }
}

module.exports = Formatter;