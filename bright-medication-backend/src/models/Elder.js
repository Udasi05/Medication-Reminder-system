// ============================================
// FILE: src/models/Elder.js
// ============================================
const mongoose = require('mongoose');

const elderSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Elder name is required'],
        trim: true
    },
    phoneNumber: {
        type: String,
        required: [true, 'Phone number is required'],
        match: [/^[6-9]\d{9}$/, 'Please enter a valid Indian phone number']
    },
    preferredLanguage: {
        type: String,
        enum: ['en', 'hi', 'mr'],
        default: 'en',
        required: true
    },
    caregiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Caregiver',
        required: true
    },
    age: {
        type: Number,
        min: 0
    },
    address: {
        type: String,
        trim: true
    },
    emergencyContact: {
        type: String,
        match: [/^[6-9]\d{9}$/, 'Please enter a valid Indian phone number']
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Indexes for performance
elderSchema.index({ caregiverId: 1, createdAt: -1 });
elderSchema.index({ phoneNumber: 1 });

// Virtual populate for medications
elderSchema.virtual('medications', {
    ref: 'Medication',
    localField: '_id',
    foreignField: 'elderId'
});

// Instance method to get elder's active medications
elderSchema.methods.getActiveMedications = async function () {
    const Medication = mongoose.model('Medication');
    return await Medication.find({
        elderId: this._id,
        active: true,
        $or: [
            { endDate: { $exists: false } },
            { endDate: { $gte: new Date() } }
        ]
    });
};
module.exports = mongoose.model('Elder', elderSchema);
