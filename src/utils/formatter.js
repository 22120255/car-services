class Formatter {
    static mapping = {
        'en-US': {
            currency: 'USD',
            locale: 'en-US',
        },
        'vi-VN': {
            currency: 'VND',
            locale: 'vi-VN',
        },
    };

    static formatNumber(value, options = { decimal: 2, shorten: true, locale: 'vi-VN' }) {
        if (typeof value !== 'number' || isNaN(value) || !isFinite(value)) {
            return '0';
        }

        const formatter = new Intl.NumberFormat(options.locale, {
            minimumFractionDigits: options.decimal,
            maximumFractionDigits: options.decimal,
        });

        const formattedValue = formatter.format(value);

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
        if (value === undefined || value === null || isNaN(Number(value))) {
            value = 0;
        } else {
            value = Number(value);
        }

        const mapping = Formatter.mapping[currency] || Formatter.mapping['vi-VN'];
        const locale = mapping.locale;

        if (typeof currency !== 'string') {
            throw new RangeError('Invalid currency code');
        }

        return new Intl.NumberFormat(locale, {
            style: 'currency',
            currency,
        }).format(value);
    }

    static formatDate(date, options = { showTime: true, locale: 'en-US' }) {
        const dateOptions = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        };

        if (options.showTime) {
            dateOptions.hour = '2-digit';
            dateOptions.minute = '2-digit';
            dateOptions.second = '2-digit';
        }

        return new Date(date).toLocaleDateString(Formatter.mapping[options.locale].locale, dateOptions);
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