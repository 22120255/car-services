class Formatter {
    static formatNumber(value, options = {}) {
        const { decimal = 2, shorten = true, locale = 'vi-VN' } = options;

        const formattedValue = value.toLocaleString(locale);

        if (!shorten) {
            return formattedValue;
        }

        if (value < 1_000) {
            return formattedValue;
        } else if (value >= 1_000 && value < 1_000_000) {
            return (value / 1_000).toFixed(decimal) + 'K';
        } else if (value >= 1_000_000 && value < 1_000_000_000) {
            return (value / 1_000_000).toFixed(decimal) + 'M';
        } else {
            return (value / 1_000_000_000).toFixed(decimal) + 'B';
        }
    }

    static formatCurrency(value, currency = 'VND') {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency,
        }).format(value);
    }

    static formatDate(date, options = {}) {
        const { showTime = true } = options;
        const dateOptions = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        };

        if (showTime) {
            dateOptions.hour = '2-digit';
            dateOptions.minute = '2-digit';
            dateOptions.second = '2-digit';
        }

        return new Date(date).toLocaleDateString('vi-VN', dateOptions);
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