// ============================================
// FILE: src/services/voice.service.js
// ============================================
const { VOICE_MESSAGES } = require('../utils/constants');

class VoiceService {
    // Mock voice call service
    async makeCall(phoneNumber, language, medicationName) {
        try {
            console.log('📞 ========== VOICE CALL SERVICE ==========');
            console.log(`📱 Calling: ${phoneNumber}`);
            console.log(`🌍 Language: ${language.toUpperCase()}`);
            console.log(`💊 Medication: ${medicationName}`);
            console.log('🗣️  Message:');
            console.log(`   ${VOICE_MESSAGES[language].greeting}`);
            console.log(`   ${VOICE_MESSAGES[language].instruction}${medicationName}`);
            console.log(`   ${VOICE_MESSAGES[language].confirmation}`);
            console.log('==========================================');

            // Simulate API call
            return {
                success: true,
                callId: `CALL_${Date.now()}`,
                timestamp: new Date(),
                message: 'Voice call initiated successfully'
            };
        } catch (error) {
            console.error('❌ Voice call failed:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }
}

module.exports = new VoiceService();