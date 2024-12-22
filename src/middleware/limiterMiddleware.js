const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'Too many requests, please try again later.',
    keyGenerator: (req) => req.ip,
    handler: (req, res) => {
        res.status(429).json({ message: 'Too many requests, your IP is temporarily blocked.' });
    },
});

module.exports = limiter;