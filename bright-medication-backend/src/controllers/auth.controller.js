const jwt = require('jsonwebtoken');
const Caregiver = require('../models/Caregiver');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
const logger = require('../utils/logger');

// Generate JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE || '7d'
    });
};

// @desc    Register a new caregiver
// @route   POST /api/auth/register
// @access  Public
exports.register = catchAsync(async (req, res, next) => {
    const { name, email, password, phoneNumber } = req.body;

    // Check if caregiver already exists
    const existingCaregiver = await Caregiver.findOne({ email });
    if (existingCaregiver) {
        return next(new AppError('Caregiver already exists with this email', 400));
    }

    // Create caregiver
    const caregiver = await Caregiver.create({
        name,
        email,
        password,
        phoneNumber
    });

    // Generate token
    const token = generateToken(caregiver._id);

    logger.info(`New caregiver registered: ${email}`);

    res.status(201).json({
        success: true,
        message: 'Caregiver registered successfully',
        data: {
            caregiver: {
                id: caregiver._id,
                name: caregiver.name,
                email: caregiver.email,
                phoneNumber: caregiver.phoneNumber
            },
            token
        }
    });
});

// @desc    Login caregiver
// @route   POST /api/auth/login
// @access  Public
exports.login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
        return next(new AppError('Please provide email and password', 400));
    }

    // Find caregiver with password
    const caregiver = await Caregiver.findOne({ email }).select('+password');

    if (!caregiver) {
        return next(new AppError('Invalid credentials', 401));
    }

    // Check password
    const isPasswordMatch = await caregiver.comparePassword(password);

    if (!isPasswordMatch) {
        return next(new AppError('Invalid credentials', 401));
    }

    // Generate token
    const token = generateToken(caregiver._id);

    logger.info(`Caregiver logged in: ${email}`);

    res.status(200).json({
        success: true,
        message: 'Login successful',
        data: {
            caregiver: {
                id: caregiver._id,
                name: caregiver.name,
                email: caregiver.email,
                phoneNumber: caregiver.phoneNumber
            },
            token
        }
    });
});

// @desc    Get current logged in caregiver
// @route   GET /api/auth/me
// @access  Private
exports.getMe = catchAsync(async (req, res, next) => {
    const caregiver = await Caregiver.findById(req.caregiver._id);

    if (!caregiver) {
        return next(new AppError('Caregiver not found', 404));
    }

    res.status(200).json({
        success: true,
        data: {
            caregiver: {
                id: caregiver._id,
                name: caregiver.name,
                email: caregiver.email,
                phoneNumber: caregiver.phoneNumber,
                createdAt: caregiver.createdAt
            }
        }
    });
});