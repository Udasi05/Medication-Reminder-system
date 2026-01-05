// ============================================
// FILE: src/services/reminder.service.js
// ============================================
const ReminderLog = require('../models/ReminderLog');
const Elder = require('../models/Elder');
const Caregiver = require('../models/Caregiver');
const voiceService = require('./voice.service');
const smsService = require('./sms.service');
const notificationService = require('./notification.service');
const { GRACE_PERIODS, STATUS } = require('../utils/constants');

class ReminderService {
    // Send initial reminder (voice call)
    async sendReminder(medication) {
        try {
            const elder = medication.elderId;

            // Create reminder log
            const reminderLog = await ReminderLog.create({
                medicationId: medication._id,
                elderId: elder._id,
                scheduledTime: new Date(),
                status: STATUS.SENT,
                voiceCallSent: false,
                smsSent: false
            });

            // Send voice call
            const voiceCallResult = await voiceService.makeCall(
                elder.phoneNumber,
                elder.preferredLanguage,
                medication.name
            );

            // Update reminder log
            await ReminderLog.findByIdAndUpdate(reminderLog._id, {
                voiceCallSent: voiceCallResult.success,
                voiceCallTime: new Date()
            });

            console.log(`✅ Voice call initiated for ${elder.name} - ${medication.name}`);

            return reminderLog;
        } catch (error) {
            console.error('❌ Error sending reminder:', error);
            throw error;
        }
    }

    // Check voice call grace period (15 minutes)
    async checkVoiceGracePeriod() {
        try {
            const gracePeriodAgo = new Date(Date.now() - GRACE_PERIODS.VOICE * 60 * 1000);

            // Find reminders where voice call was sent but no confirmation
            const expiredReminders = await ReminderLog.find({
                status: STATUS.SENT,
                voiceCallSent: true,
                confirmationMethod: 'none',
                voiceCallTime: { $lte: gracePeriodAgo },
                smsSent: false
            }).populate('elderId medicationId');

            for (const reminder of expiredReminders) {
                console.log(`⏰ Voice grace period expired for ${reminder.elderId.name} - sending SMS`);
                await this.escalateToSMS(reminder);
            }
        } catch (error) {
            console.error('❌ Error checking voice grace period:', error);
        }
    }

    // Escalate to SMS
    async escalateToSMS(reminderLog) {
        try {
            const elder = await Elder.findById(reminderLog.elderId);
            const medication = await reminderLog.populate('medicationId');

            // Send SMS
            const smsResult = await smsService.sendSMS(
                elder.phoneNumber,
                elder.preferredLanguage,
                medication.medicationId.name
            );

            // Update reminder log
            await ReminderLog.findByIdAndUpdate(reminderLog._id, {
                smsSent: smsResult.success,
                smsTime: new Date()
            });

            console.log(`📱 SMS sent to ${elder.name}`);
        } catch (error) {
            console.error('❌ Error escalating to SMS:', error);
        }
    }

    // Check SMS grace period (10 minutes)
    async checkSMSGracePeriod() {
        try {
            const gracePeriodAgo = new Date(Date.now() - GRACE_PERIODS.SMS * 60 * 1000);

            // Find reminders where SMS was sent but no confirmation
            const missedReminders = await ReminderLog.find({
                status: STATUS.SENT,
                smsSent: true,
                confirmationMethod: 'none',
                smsTime: { $lte: gracePeriodAgo },
                alertSentToCaregiver: false
            }).populate('elderId medicationId');

            for (const reminder of missedReminders) {
                console.log(`🔴 Medication MISSED for ${reminder.elderId.name} - alerting caregiver`);
                await this.markAsMissed(reminder);
            }
        } catch (error) {
            console.error('❌ Error checking SMS grace period:', error);
        }
    }

    // Mark as missed and alert caregiver
    async markAsMissed(reminderLog) {
        try {
            const elder = await Elder.findById(reminderLog.elderId).populate('caregiverId');
            const medication = await reminderLog.populate('medicationId');

            // Update status to missed
            await ReminderLog.findByIdAndUpdate(reminderLog._id, {
                status: STATUS.MISSED,
                alertSentToCaregiver: true,
                caregiverAlertTime: new Date()
            });

            // Send alert to caregiver
            await notificationService.alertCaregiver(
                elder.caregiverId,
                elder,
                medication.medicationId
            );

            console.log(`🚨 Caregiver alerted for missed medication: ${elder.name} - ${medication.medicationId.name}`);
        } catch (error) {
            console.error('❌ Error marking as missed:', error);
        }
    }

    // Confirm medication taken
    async confirmMedication(reminderLogId, method = 'manual') {
        try {
            const reminderLog = await ReminderLog.findByIdAndUpdate(
                reminderLogId,
                {
                    status: STATUS.TAKEN,
                    confirmationMethod: method,
                    confirmationTime: new Date()
                },
                { new: true }
            );

            console.log(`✅ Medication confirmed as TAKEN via ${method}`);
            return reminderLog;
        } catch (error) {
            console.error('❌ Error confirming medication:', error);
            throw error;
        }
    }
}

module.exports = new ReminderService();