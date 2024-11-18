const logger = require("../config/logger")

const errorLog = (file, index, message) => {
    logger.error(`File: ${file}, line: ${index}, error: ${message}`);
}
module.exports = { errorLog }