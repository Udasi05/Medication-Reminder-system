// ============================================
// FILE: src/routes/reminder.routes.js
// ============================================
const express = require('express');
const {
    getAllReminders,
    getRemindersByElder,
    getTodayReminders,
    confirmReminder,
    getAdherenceStats
} = require('../controllers/reminder.controller');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

// Apply authentication to all routes
router.use(protect);

// Routes
router.get('/', getAllReminders);
router.get('/today', getTodayReminders);
router.get('/stats', getAdherenceStats);
router.get('/elder/:elderId', getRemindersByElder);
router.put('/:id/confirm', confirmReminder);

module.exports = router;