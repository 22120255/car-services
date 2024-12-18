const redisClient = require('../config/redis');
const { errorLog } = require('../utils/customLog');

async function cacheMiddleware(req, res, next) {
  const domain = process.env.DOMAIN_URL;
  let key = `${domain}${req.originalUrl || req.url}`;
  if (req.isAuthenticated()) {
    key = `${key}/${req.user._id}`;
  }
  try {
    const cachedResponse = await redisClient.get(key);

    if (cachedResponse) {
      res.send(JSON.parse(cachedResponse));
    } else {
      res.sendResponse = res.send;
      res.send = async (body) => {
        await redisClient.set(key, JSON.stringify(body), {
          EX: 100, // Set expiration time in seconds
        });
        res.sendResponse(body);
      };
      next();
    }
  } catch (err) {
    errorLog('cacheMiddleware', 'cacheMiddleware', err);
    next();
  }
}

module.exports = cacheMiddleware;
