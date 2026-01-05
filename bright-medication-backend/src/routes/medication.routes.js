// ============================================
// FILE: src/routes/medication.routes.js (UPDATED with new validators)
// ============================================
const express = require('express');
const validators = require('../utils/validators');
const {
    getMedicationsByElder,
    getMedicationById,
    createMedication,
    updateMedication,
    deleteMedication
} = require('../controllers/medication.controller');
const { protect } = require('../middleware/auth.middleware');
const { validate } = require('../middleware/validation.middleware');

const router = express.Router();

// Apply authentication to all routes
router.use(protect);

// Routes
router.post('/', validators.createMedication, validate, createMedication);
router.get('/elder/:elderId', validators.mongoIdParam('elderId'), validate, getMedicationsByElder);
router.get('/:id', validators.mongoId, validate, getMedicationById);
router.put('/:id', [...validators.mongoId, ...validators.updateMedication], validate, updateMedication);
router.delete('/:id', validators.mongoId, validate, deleteMedication);

module.exports = router;