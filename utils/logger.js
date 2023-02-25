const winston = require('winston');

// Define logging levels
const myLevels = {
  levels: {
    error: 0,
    warn: 1,
    info: 2,
    debug: 3,
  },
  colors: {
    error: 'white',
    warn: 'yellow',
    info: 'green',
    debug: 'blue',
  },
};

// Configure logger
const logger = winston.createLogger({
  level: 'debug',
  levels: myLevels.levels,
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.colorize({ all: true }),
    winston.format.printf(
      (info) => `${info.timestamp} ${info.level}: ${info.message}`
    )
  ),
  transports: [new winston.transports.Console(),new winston.transports.File({ filename: 'logfile.log' })],
});

module.exports = logger;