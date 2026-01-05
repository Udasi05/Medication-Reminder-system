const logger = require('../utils/logger');
const AppError = require('../utils/AppError');

// Handle specific mongoose errors
const handleCastErrorDB = (err) => {
    const message = `Invalid ${err.path}: ${err.value}`;
    return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
    const field = Object.keys(err.keyValue)[0];
    const value = err.keyValue[field];
    const message = `Duplicate field value: ${field} = "${value}". Please use another value!`;
    return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
    const errors = Object.values(err.errors).map(el => el.message);
    const message = `Invalid input data. ${errors.join('. ')}`;
    return new AppError(message, 400);
};

const handleJWTError = () =>
    new AppError('Invalid token. Please log in again!', 401);

const handleJWTExpiredError = () =>
    new AppError('Your token has expired! Please log in again.', 401);

// Send error in development
const sendErrorDev = (err, res) => {
    logger.error('ERROR 💥', {
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack
    });

    res.status(err.statusCode).json({
        success: false,
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack
    });
};

// Send error in production
const sendErrorProd = (err, res) => {
    // Operational, trusted error: send message to client
    if (err.isOperational) {
        res.status(err.statusCode).json({
            success: false,
            status: err.status,
            message: err.message
        });
    }
    // Programming or unknown error: don't leak error details
    else {
        logger.error('ERROR 💥', err);

        res.status(500).json({
            success: false,
            status: 'error',
            message: 'Something went wrong! Please try again later.'
        });
    }
};

// Global error handler
const errorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(err, res);
    } else if (process.env.NODE_ENV === 'production') {
        let error = { ...err };
        error.message = err.message;

        // Mongoose bad ObjectId
        if (err.name === 'CastError') error = handleCastErrorDB(error);

        // Mongoose duplicate key
        if (err.code === 11000) error = handleDuplicateFieldsDB(error);

        // Mongoose validation error
        if (err.name === 'ValidationError') error = handleValidationErrorDB(error);

        // JWT errors
        if (err.name === 'JsonWebTokenError') error = handleJWTError();
        if (err.name === 'TokenExpiredError') error = handleJWTExpiredError();

        sendErrorProd(error, res);
    }
};
module.exports = errorHandler;