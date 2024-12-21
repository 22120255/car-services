const logger = require("../config/logger")

const errorLog = (file, func, message) => {
    if (process.env.NODE_ENV === 'development') {
        console.log(`File: ${file}, func: ${func}, error: ${message}`);
    } else {
        logger.error(`File: ${file}, func: ${func}, error: ${message}`);
    }
}

const infoLog = (file, func, message) => {
    if (process.env.NODE_ENV === 'development') {
        console.log(`File: ${file}, func: ${func}, message: ${message}`);
    }
    else {
        logger.error(`File: ${file}, func: ${func}, message: ${message}`);
    }
}


module.exports = { errorLog, infoLog }