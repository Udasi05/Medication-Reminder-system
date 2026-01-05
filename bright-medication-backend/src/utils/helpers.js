// ============================================
// FILE: src/utils/helpers.js
// ============================================
const logger = require('./logger');

/**
 * Time helper functions
 */
const timeHelpers = {
    // Get current time in HH:MM format
    getCurrentTime: () => {
        const now = new Date();
        return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    },

    // Convert HH:MM to Date object for today
    timeToDate: (timeString) => {
        const [hours, minutes] = timeString.split(':').map(Number);
        const date = new Date();
        date.setHours(hours, minutes, 0, 0);
        return date;
    },

    // Check if time is within range
    isTimeInRange: (time, startTime, endTime) => {
        return time >= startTime && time <= endTime;
    },

    // Add minutes to time
    addMinutes: (date, minutes) => {
        return new Date(date.getTime() + minutes * 60000);
    },

    // Format date to readable string
    formatDate: (date) => {
        return new Date(date).toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    },

    // Format time to readable string
    formatTime: (date) => {
        return new Date(date).toLocaleTimeString('en-IN', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    }
};

/**
 * Response formatters
 */
const responseHelpers = {
    // Success response
    success: (res, data, message = 'Success', statusCode = 200) => {
        return res.status(statusCode).json({
            success: true,
            message,
            data
        });
    },

    // Created response
    created: (res, data, message = 'Created successfully') => {
        return res.status(201).json({
            success: true,
            message,
            data
        });
    },

    // Paginated response
    paginated: (res, data, page, limit, total) => {
        return res.status(200).json({
            success: true,
            data,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        });
    }
};

/**
 * Data sanitization
 */
const sanitizeHelpers = {
    // Remove sensitive fields from object
    removeSensitiveFields: (obj, fields = ['password', '__v']) => {
        const sanitized = { ...obj };
        fields.forEach(field => delete sanitized[field]);
        return sanitized;
    },

    // Sanitize user input
    sanitizeInput: (input) => {
        if (typeof input === 'string') {
            return input.trim().replace(/[<>]/g, '');
        }
        return input;
    }
};

/**
 * Pagination helper
 */
const paginationHelper = (page = 1, limit = 10) => {
    const skip = (page - 1) * limit;
    return { skip, limit: parseInt(limit) };
};

/**
 * Generate random reference ID
 */
const generateReferenceId = (prefix = 'REF') => {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 7);
    return `${prefix}_${timestamp}_${random}`.toUpperCase();
};

/**
 * Calculate adherence rate
 */
const calculateAdherenceRate = (takenCount, totalCount) => {
    if (totalCount === 0) return 0;
    return Math.round((takenCount / totalCount) * 100);
};

/**
 * Group reminders by date
 */
const groupRemindersByDate = (reminders) => {
    return reminders.reduce((groups, reminder) => {
        const date = new Date(reminder.scheduledTime).toDateString();
        if (!groups[date]) {
            groups[date] = [];
        }
        groups[date].push(reminder);
        return groups;
    }, {});
};

module.exports = {
    timeHelpers,
    responseHelpers,
    sanitizeHelpers,
    paginationHelper,
    generateReferenceId,
    calculateAdherenceRate,
    groupRemindersByDate
};