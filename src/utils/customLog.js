const logger = require("../config/logger")
const fs = require('fs');
const path = require('path');

const errorLog = (file, func, message) => {
    if (process.env.NODE_ENV === 'development') {
        console.error(`File: ${file}, func: ${func}, error: ${message}`);
    } else {
        logger('error').error(`File: ${file}, func: ${func}, error: ${message}`);
    }
}

const infoLog = (file, func, message) => {
    if (process.env.NODE_ENV === 'development') {
        console.log(`File: ${file}, func: ${func}, message: ${message}`);
        logger('info').info(`File: ${file}, func: ${func}, message: ${message}`);
    }
    else {
        logger('info').info(`File: ${file}, func: ${func}, message: ${message}`);
    }
}

const clearFileLogs = (type) => {
    const logFilePath = path.join(__dirname, '../logs', `${type}.log`);

    if (fs.existsSync(logFilePath)) {
        fs.unlinkSync(logFilePath);
    }
}


module.exports = { errorLog, infoLog, clearFileLogs }