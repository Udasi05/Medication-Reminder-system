// ============================================
// FILE: src/server.js (UPDATED with logging)
// ============================================
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/database');
const schedulerService = require('./services/scheduler.service');
const logger = require('./utils/logger');
const { requestLogger, logAPICall } = require('./middleware/logger.middleware');
const errorHandler = require('./middleware/error.middleware'); // We'll create this next

// Load env variables
dotenv.config();

// Initialize express
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware
app.use(requestLogger);
app.use(logAPICall);

// Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/elders', require('./routes/elder.routes'));
app.use('/api/medications', require('./routes/medication.routes'));
app.use('/api/reminders', require('./routes/reminder.routes'));

// Health check
app.get('/api/health', (req, res) => {
    logger.info('Health check called');
    res.json({
        status: 'OK',
        message: 'Bright Medication Reminder API is running',
        timestamp: new Date().toISOString()
    });
});

// Error handler middleware (must be last)
app.use(errorHandler);

// Start scheduler
schedulerService.startScheduler();

// Start server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
    logger.info(`🚀 Server running on port ${PORT}`);
    logger.info(`📅 Scheduler service started`);
    logger.info(`📝 Logs directory: ./logs/`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    logger.error(`Unhandled Rejection: ${err.message}`);
    server.close(() => process.exit(1));
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
    logger.error(`Uncaught Exception: ${err.message}`);
    process.exit(1);
});
