const { createLogger, format, transports } = require('winston');

const logger = (type) => {
    return createLogger({
        level: type,
        format: format.combine(
            format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
            format.printf(({ timestamp, level, message }) => {
                return `${timestamp} [${level.toUpperCase()}]: ${message}`;
            })
        ),
        transports: [
            new transports.File({ filename: `src/logs/${type}.log` }),
        ]
    })
}

module.exports = logger;
