const redisClient = require('../config/redis');

const clearCache = (key) => {
  redisClient.del(key, (err, response) => {
    if (err) {
      console.error('Error clearing cache:', err);
    }
  });
};

module.exports = {
  clearCache,
};
