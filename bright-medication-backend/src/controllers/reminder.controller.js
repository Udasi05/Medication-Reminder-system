// ============================================
// FILE: src/controllers/reminder.controller.js
// ============================================
const ReminderLog = require('../models/ReminderLog');
const Elder = require('../models/Elder');
const reminderService = require('../services/reminder.service');

// @desc    Get all reminder logs for caregiver's elders
// @route   GET /api/reminders
// @access  Private
exports.getAllReminders = async (req, res) => {
    try {
        // Get all elders for this caregiver
        const elders = await Elder.find({ caregiverId: req.caregiver._id });
        const elderIds = elders.map(elder => elder._id);

        // Get reminder logs
        const reminders = await ReminderLog.find({ elderId: { $in: elderIds } })
            .populate('elderId', 'name phoneNumber preferredLanguage')
            .populate('medicationId', 'name dosage')
            .sort({ scheduledTime: -1 })
            .limit(100);

        res.status(200).json({
            success: true,
            count: reminders.length,
            data: reminders
        });
    } catch (error) {
        console.error('Get reminders error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching reminders',
            error: error.message
        });
    }
};

// @desc    Get reminder logs for specific elder
// @route   GET /api/reminders/elder/:elderId
// @access  Private
exports.getRemindersByElder = async (req, res) => {
    try {
        // Verify elder belongs to caregiver
        const elder = await Elder.findOne({
            _id: req.params.elderId,
            caregiverId: req.caregiver._id
        });

        if (!elder) {
            return res.status(404).json({
                success: false,
                message: 'Elder not found'
            });
        }

        const reminders = await ReminderLog.find({ elderId: req.params.elderId })
            .populate('medicationId', 'name dosage')
            .sort({ scheduledTime: -1 });

        res.status(200).json({
            success: true,
            count: reminders.length,
            data: reminders
        });
    } catch (error) {
        console.error('Get elder reminders error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching reminders',
            error: error.message
        });
    }
};

// @desc    Get today's reminders
// @route   GET /api/reminders/today
// @access  Private
exports.getTodayReminders = async (req, res) => {
    try {
        // Get all elders for this caregiver
        const elders = await Elder.find({ caregiverId: req.caregiver._id });
        const elderIds = elders.map(elder => elder._id);

        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        const reminders = await ReminderLog.find({
            elderId: { $in: elderIds },
            scheduledTime: {
                $gte: startOfDay,
                $lte: endOfDay
            }
        })
            .populate('elderId', 'name phoneNumber')
            .populate('medicationId', 'name dosage')
            .sort({ scheduledTime: -1 });

        // Group by status
        const summary = {
            total: reminders.length,
            taken: reminders.filter(r => r.status === 'taken').length,
            missed: reminders.filter(r => r.status === 'missed').length,
            pending: reminders.filter(r => r.status === 'sent').length
        };

        res.status(200).json({
            success: true,
            summary,
            data: reminders
        });
    } catch (error) {
        console.error('Get today reminders error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching today\'s reminders',
            error: error.message
        });
    }
};

// @desc    Manually confirm medication taken
// @route   PUT /api/reminders/:id/confirm
// @access  Private
exports.confirmReminder = async (req, res) => {
    try {
        const reminder = await ReminderLog.findById(req.params.id)
            .populate('elderId');

        if (!reminder) {
            return res.status(404).json({
                success: false,
                message: 'Reminder not found'
            });
        }

        // Verify elder belongs to caregiver
        if (reminder.elderId.caregiverId.toString() !== req.caregiver._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized'
            });
        }

        // Confirm the reminder
        const updatedReminder = await reminderService.confirmMedication(
            reminder._id,
            'manual'
        );

        res.status(200).json({
            success: true,
            message: 'Medication marked as taken',
            data: updatedReminder
        });
    } catch (error) {
        console.error('Confirm reminder error:', error);
        res.status(500).json({
            success: false,
            message: 'Error confirming reminder',
            error: error.message
        });
    }
};

// @desc    Get adherence statistics
// @route   GET /api/reminders/stats
// @access  Private
exports.getAdherenceStats = async (req, res) => {
    try {
        // Get all elders for this caregiver
        const elders = await Elder.find({ caregiverId: req.caregiver._id });
        const elderIds = elders.map(elder => elder._id);

        // Last 7 days
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const reminders = await ReminderLog.find({
            elderId: { $in: elderIds },
            scheduledTime: { $gte: sevenDaysAgo }
        });

        const totalReminders = reminders.length;
        const takenReminders = reminders.filter(r => r.status === 'taken').length;
        const missedReminders = reminders.filter(r => r.status === 'missed').length;
        const pendingReminders = reminders.filter(r => r.status === 'sent').length;

        const adherenceRate = totalReminders > 0
            ? ((takenReminders / totalReminders) * 100).toFixed(2)
            : 0;

        res.status(200).json({
            success: true,
            data: {
                period: 'Last 7 days',
                totalReminders,
                takenReminders,
                missedReminders,
                pendingReminders,
                adherenceRate: `${adherenceRate}%`
            }
        });
    } catch (error) {
        console.error('Get stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching statistics',
            error: error.message
        });
    }
};

