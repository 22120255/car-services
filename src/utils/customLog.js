const logger = require("../config/logger")

const errorLog = (file, func, message) => {
    logger.error(`File: ${file}, func: ${func}, error: ${message}`);
}
module.exports = { errorLog }