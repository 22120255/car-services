const logger = require("../config/logger")

const errorLog = (file, index, message) => {
    logger.error(`File: ${file}, line: ${index}, error: ${message}`);
}
const errorLog2 = (file, func, message) => {
    logger.error(`File: ${file}, func: ${func}, error: ${message}`);
}
module.exports = { errorLog, errorLog2 }