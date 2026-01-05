// ============================================
// FILE: src/services/sms.service.js
// ============================================
const { SMS_MESSAGES } = require('../utils/constants');

class SMSService {
    // Mock SMS service
    async sendSMS(phoneNumber, language, medicationName) {
        try {
            const message = SMS_MESSAGES[language](medicationName);

            console.log('📱 ========== SMS SERVICE ==========');
            console.log(`📞 To: ${phoneNumber}`);
            console.log(`🌍 Language: ${language.toUpperCase()}`);
            console.log(`💬 Message: ${message}`);
            console.log('====================================');

            // Simulate API call
            return {
                success: true,
                smsId: `SMS_${Date.now()}`,
                timestamp: new Date(),
                message: 'SMS sent successfully'
            };
        } catch (error) {
            console.error('❌ SMS failed:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }
}

module.exports = new SMSService();