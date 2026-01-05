// ============================================
// FILE: src/models/Caregiver.js
// ============================================
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const caregiverSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: 6,
        select: false
    },
    phoneNumber: {
        type: String,
        required: [true, 'Phone number is required'],
        match: [/^[6-9]\d{9}$/, 'Please enter a valid Indian phone number']
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Hash password before saving
caregiverSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare passwords
caregiverSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('Caregiver', caregiverSchema);

