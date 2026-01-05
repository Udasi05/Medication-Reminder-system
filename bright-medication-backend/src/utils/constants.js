
// ============================================
// FILE: src/utils/constants.js
// ============================================
module.exports = {
    LANGUAGES: {
        en: 'English',
        hi: 'Hindi',
        mr: 'Marathi'
    },

    VOICE_MESSAGES: {
        en: {
            greeting: "Hello, this is a medication reminder.",
            instruction: "It's time to take your medicine: ",
            confirmation: "Press 1 to confirm you have taken the medicine."
        },
        hi: {
            greeting: "नमस्ते, यह दवा की याद दिलाने के लिए कॉल है।",
            instruction: "अब आपकी दवा लेने का समय है: ",
            confirmation: "दवा ली है यह बताने के लिए 1 दबाएं।"
        },
        mr: {
            greeting: "नमस्कार, ही औषध आठवण करून देण्यासाठी कॉल आहे।",
            instruction: "आता तुमची औषधे घेण्याची वेळ आहे: ",
            confirmation: "औषध घेतल्याची पुष्टी करण्यासाठी 1 दाबा।"
        }
    },

    SMS_MESSAGES: {
        en: (medicationName) => `Reminder: Please take your medicine - ${medicationName}`,
        hi: (medicationName) => `अनुस्मारक: कृपया अपनी दवा लें - ${medicationName}`,
        mr: (medicationName) => `आठवण: कृपया आपली औषधे घ्या - ${medicationName}`
    },

    GRACE_PERIODS: {
        VOICE: parseInt(process.env.GRACE_PERIOD_VOICE) || 15, // minutes
        SMS: parseInt(process.env.GRACE_PERIOD_SMS) || 10 // minutes
    },

    STATUS: {
        SENT: 'sent',
        TAKEN: 'taken',
        MISSED: 'missed'
    }
};