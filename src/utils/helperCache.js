const redisClient = require('../config/redis');
const { errorLog } = require('./customLog');

const clearCache = (key) => {
  const domain = process.env.DOMAIN_URL;
  redisClient.del(`${domain}/${key}`, (err, response) => {
    if (err) {
      errorLog("helperCache", "clearCache", err);
    }
  })
}

module.exports = {
  clearCache,
};
