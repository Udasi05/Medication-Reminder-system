// ============================================
// FILE: src/services/scheduler.service.js
// ============================================
const cron = require('node-cron');
const Medication = require('../models/Medication');
const ReminderLog = require('../models/ReminderLog');
const reminderService = require('./reminder.service');

class SchedulerService {
    constructor() {
        this.jobs = [];
    }

    // Main scheduler - runs every minute
    startScheduler() {
        console.log('🕐 Starting medication reminder scheduler...');

        // Run every minute to check for scheduled medications
        const job = cron.schedule('* * * * *', async () => {
            await this.checkAndSendReminders();
        });

        // Also check for grace period expirations
        const gracePeriodJob = cron.schedule('* * * * *', async () => {
            await this.checkGracePeriods();
        });

        this.jobs.push(job, gracePeriodJob);
        console.log('✅ Scheduler started successfully');
    }

    // Check for medications due now
    async checkAndSendReminders() {
        try {
            const now = new Date();
            const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

            // Find all active medications
            const medications = await Medication.find({
                active: true,
                $or: [
                    { endDate: { $exists: false } },
                    { endDate: { $gte: now } }
                ]
            }).populate('elderId');

            for (const medication of medications) {
                // Check if current time matches any scheduled time
                if (medication.times.includes(currentTime)) {
                    // Check if reminder already sent for this medication today at this time
                    const startOfDay = new Date(now);
                    startOfDay.setHours(0, 0, 0, 0);

                    const existingReminder = await ReminderLog.findOne({
                        medicationId: medication._id,
                        scheduledTime: {
                            $gte: startOfDay,
                            $lt: new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000)
                        }
                    });

                    // Only send if no reminder exists for today at this time
                    if (!existingReminder) {
                        console.log(`📞 Triggering reminder for ${medication.elderId.name} - ${medication.name} at ${currentTime}`);
                        await reminderService.sendReminder(medication);
                    }
                }
            }
        } catch (error) {
            console.error('❌ Scheduler error:', error);
        }
    }

    // Check for grace period expirations
    async checkGracePeriods() {
        try {
            await reminderService.checkVoiceGracePeriod();
            await reminderService.checkSMSGracePeriod();
        } catch (error) {
            console.error('❌ Grace period check error:', error);
        }
    }

    stopScheduler() {
        this.jobs.forEach(job => job.stop());
        console.log('🛑 Scheduler stopped');
    }
}

module.exports = new SchedulerService();







