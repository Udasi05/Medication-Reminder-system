const jwt = require('jsonwebtoken');
const Caregiver = require('../models/Caregiver');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

exports.protect = catchAsync(async (req, res, next) => {
    let token;

    // Check for token in headers
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return next(new AppError('Not authorized to access this route', 401));
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get caregiver from token
    const caregiver = await Caregiver.findById(decoded.id);

    if (!caregiver) {
        return next(new AppError('Caregiver not found', 401));
    }

    // Grant access to protected route
    req.caregiver = caregiver;
    next();
});