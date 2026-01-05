// ============================================
// FILE: src/middleware/logger.middleware.js
// ============================================
const logger = require('../utils/logger');
const morgan = require('morgan');

// Custom Morgan tokens
morgan.token('body', (req) => {
    // Don't log password
    if (req.body && req.body.password) {
        const sanitized = { ...req.body };
        sanitized.password = '***';
        return JSON.stringify(sanitized);
    }
    return JSON.stringify(req.body);
});

// Request logger middleware
const requestLogger = morgan(
    ':method :url :status :res[content-length] - :response-time ms :body',
    { stream: logger.stream }
);

// Log API calls
const logAPICall = (req, res, next) => {
    const start = Date.now();

    res.on('finish', () => {
        const duration = Date.now() - start;
        const logData = {
            method: req.method,
            url: req.originalUrl,
            status: res.statusCode,
            duration: `${duration}ms`,
            ip: req.ip,
            userAgent: req.get('user-agent')
        };

        if (res.statusCode >= 500) {
            logger.error(`API Error: ${JSON.stringify(logData)}`);
        } else if (res.statusCode >= 400) {
            logger.warn(`API Warning: ${JSON.stringify(logData)}`);
        } else {
            logger.info(`API Call: ${JSON.stringify(logData)}`);
        }
    });

    next();
};

// Log scheduler events
const logSchedulerEvent = (eventType, data) => {
    logger.info(`[SCHEDULER] ${eventType}: ${JSON.stringify(data)}`);
};

// Log reminder events
const logReminderEvent = (eventType, elderName, medicationName, details = {}) => {
    const logMessage = {
        event: eventType,
        elder: elderName,
        medication: medicationName,
        ...details
    };
    logger.info(`[REMINDER] ${JSON.stringify(logMessage)}`);
};

// Log service events (Voice, SMS, etc.)
const logServiceEvent = (service, action, data) => {
    logger.info(`[${service.toUpperCase()}] ${action}: ${JSON.stringify(data)}`);
};

module.exports = {
    requestLogger,
    logAPICall,
    logSchedulerEvent,
    logReminderEvent,
    logServiceEvent
};