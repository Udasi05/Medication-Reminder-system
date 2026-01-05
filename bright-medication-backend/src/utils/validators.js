// ============================================
// FILE: src/utils/validators.js
// ============================================
const { body, param, query } = require('express-validator');

// Phone number validator (Indian format)
const isValidPhoneNumber = (value) => {
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(value)) {
        throw new Error('Please provide a valid Indian phone number (10 digits starting with 6-9)');
    }
    return true;
};

// Time format validator (HH:MM)
const isValidTimeFormat = (value) => {
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRegex.test(value)) {
        throw new Error('Time must be in HH:MM format (e.g., 08:00, 14:30)');
    }
    return true;
};

// Date validator (not in past)
const isNotPastDate = (value) => {
    const inputDate = new Date(value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (inputDate < today) {
        throw new Error('Date cannot be in the past');
    }
    return true;
};

// Validate medication times array
const validateMedicationTimes = (times) => {
    if (!Array.isArray(times) || times.length === 0) {
        throw new Error('At least one medication time is required');
    }

    // Check each time format
    times.forEach(time => {
        isValidTimeFormat(time);
    });

    // Check for duplicates
    const uniqueTimes = new Set(times);
    if (uniqueTimes.size !== times.length) {
        throw new Error('Duplicate medication times are not allowed');
    }

    return true;
};

// Language validator
const isValidLanguage = (value) => {
    const validLanguages = ['en', 'hi', 'mr'];
    if (!validLanguages.includes(value)) {
        throw new Error('Language must be one of: en (English), hi (Hindi), mr (Marathi)');
    }
    return true;
};

// Validation schemas
const validators = {
    // Auth validators
    register: [
        body('name')
            .trim()
            .notEmpty().withMessage('Name is required')
            .isLength({ min: 2, max: 50 }).withMessage('Name must be between 2-50 characters'),
        body('email')
            .trim()
            .notEmpty().withMessage('Email is required')
            .isEmail().withMessage('Please provide a valid email')
            .normalizeEmail(),
        body('password')
            .notEmpty().withMessage('Password is required')
            .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
        body('phoneNumber')
            .trim()
            .notEmpty().withMessage('Phone number is required')
            .custom(isValidPhoneNumber)
    ],

    login: [
        body('email')
            .trim()
            .notEmpty().withMessage('Email is required')
            .isEmail().withMessage('Please provide a valid email'),
        body('password')
            .notEmpty().withMessage('Password is required')
    ],

    // Elder validators
    createElder: [
        body('name')
            .trim()
            .notEmpty().withMessage('Elder name is required')
            .isLength({ min: 2, max: 50 }).withMessage('Name must be between 2-50 characters'),
        body('phoneNumber')
            .trim()
            .notEmpty().withMessage('Phone number is required')
            .custom(isValidPhoneNumber),
        body('preferredLanguage')
            .notEmpty().withMessage('Preferred language is required')
            .custom(isValidLanguage),
        body('age')
            .optional()
            .isInt({ min: 0, max: 150 }).withMessage('Age must be between 0-150'),
        body('emergencyContact')
            .optional()
            .custom(isValidPhoneNumber)
    ],

    updateElder: [
        body('name')
            .optional()
            .trim()
            .isLength({ min: 2, max: 50 }).withMessage('Name must be between 2-50 characters'),
        body('phoneNumber')
            .optional()
            .trim()
            .custom(isValidPhoneNumber),
        body('preferredLanguage')
            .optional()
            .custom(isValidLanguage),
        body('age')
            .optional()
            .isInt({ min: 0, max: 150 }).withMessage('Age must be between 0-150')
    ],

    // Medication validators
    createMedication: [
        body('name')
            .trim()
            .notEmpty().withMessage('Medication name is required')
            .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2-100 characters'),
        body('dosage')
            .trim()
            .notEmpty().withMessage('Dosage is required'),
        body('elderId')
            .notEmpty().withMessage('Elder ID is required')
            .isMongoId().withMessage('Invalid Elder ID'),
        body('times')
            .notEmpty().withMessage('Medication times are required')
            .custom(validateMedicationTimes),
        body('startDate')
            .optional()
            .isISO8601().withMessage('Invalid date format')
            .custom(isNotPastDate),
        body('endDate')
            .optional()
            .isISO8601().withMessage('Invalid date format')
            .custom((value, { req }) => {
                const startDate = new Date(req.body.startDate || Date.now());
                const endDate = new Date(value);
                if (endDate <= startDate) {
                    throw new Error('End date must be after start date');
                }
                return true;
            })
    ],

    updateMedication: [
        body('name')
            .optional()
            .trim()
            .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2-100 characters'),
        body('times')
            .optional()
            .custom(validateMedicationTimes),
        body('endDate')
            .optional()
            .isISO8601().withMessage('Invalid date format')
    ],

    // ID param validator
    mongoId: [
        param('id').isMongoId().withMessage('Invalid ID format')
    ],
    // Add this to your validators object
    mongoIdParam: (paramName = 'id') => [
        param(paramName)
            .custom((value) => {
                // Check if it's a valid MongoDB ObjectId
                if (!/^[0-9a-fA-F]{24}$/.test(value)) {
                    throw new Error('Invalid ID format');
                }
                return true;
            })
    ]
};

module.exports = validators;