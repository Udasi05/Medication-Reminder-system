// ============================================
// FILE: src/models/Medication.js
// ============================================
const mongoose = require('mongoose');

const medicationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Medication name is required'],
        trim: true
    },
    dosage: {
        type: String,
        required: [true, 'Dosage is required'],
        trim: true
    },
    elderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Elder',
        required: true
    },
    times: [{
        type: String,
        required: true,
        match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Time must be in HH:MM format']
    }],
    startDate: {
        type: Date,
        required: true,
        default: Date.now
    },
    endDate: {
        type: Date
    },
    instructions: {
        type: String,
        trim: true
    },
    active: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Index for efficient querying
medicationSchema.index({ elderId: 1, active: 1 });

module.exports = mongoose.model('Medication', medicationSchema);

