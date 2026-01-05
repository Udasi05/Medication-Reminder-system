// ============================================
// FILE: src/models/ReminderLog.js
// ============================================
const mongoose = require('mongoose');

const reminderLogSchema = new mongoose.Schema({
    medicationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Medication',
        required: true
    },
    elderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Elder',
        required: true
    },
    scheduledTime: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['sent', 'taken', 'missed'],
        default: 'sent'
    },
    voiceCallSent: {
        type: Boolean,
        default: false
    },
    voiceCallTime: {
        type: Date
    },
    smsSent: {
        type: Boolean,
        default: false
    },
    smsTime: {
        type: Date
    },
    confirmationMethod: {
        type: String,
        enum: ['call_disconnect', 'keypad', 'manual', 'none'],
        default: 'none'
    },
    confirmationTime: {
        type: Date
    },
    alertSentToCaregiver: {
        type: Boolean,
        default: false
    },
    caregiverAlertTime: {
        type: Date
    },
    notes: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Compound indexes for performance
reminderLogSchema.index({ elderId: 1, scheduledTime: -1 });
reminderLogSchema.index({ status: 1, scheduledTime: -1 });
reminderLogSchema.index({ medicationId: 1, status: 1 });
reminderLogSchema.index({ elderId: 1, status: 1, scheduledTime: -1 });

// Static method to get adherence stats for an elder
reminderLogSchema.statics.getAdherenceStats = async function (elderId, days = 7) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const stats = await this.aggregate([
        {
            $match: {
                elderId: mongoose.Types.ObjectId(elderId),
                scheduledTime: { $gte: startDate }
            }
        },
        {
            $group: {
                _id: '$status',
                count: { $sum: 1 }
            }
        }
    ]);

    const result = {
        total: 0,
        taken: 0,
        missed: 0,
        pending: 0
    };

    stats.forEach(stat => {
        result[stat._id] = stat.count;
        result.total += stat.count;
    });

    result.adherenceRate = result.total > 0
        ? Math.round((result.taken / result.total) * 100)
        : 0;

    return result;
};

// Static method to get daily adherence trend
reminderLogSchema.statics.getDailyTrend = async function (elderId, days = 7) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    return await this.aggregate([
        {
            $match: {
                elderId: mongoose.Types.ObjectId(elderId),
                scheduledTime: { $gte: startDate }
            }
        },
        {
            $group: {
                _id: {
                    date: { $dateToString: { format: '%Y-%m-%d', date: '$scheduledTime' } },
                    status: '$status'
                },
                count: { $sum: 1 }
            }
        },
        {
            $sort: { '_id.date': 1 }
        }
    ]);
};

module.exports = mongoose.model('ReminderLog', reminderLogSchema);