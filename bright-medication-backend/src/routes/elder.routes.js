// ============================================
// FILE: src/routes/elder.routes.js (UPDATED with new validators)
// ============================================
const express = require('express');
const validators = require('../utils/validators');
const {
    getAllElders,
    getElderById,
    createElder,
    updateElder,
    deleteElder
} = require('../controllers/elder.controller');
const { protect } = require('../middleware/auth.middleware');
const { validate } = require('../middleware/validation.middleware');

const router = express.Router();

// Apply authentication to all routes
router.use(protect);

// Routes
router.route('/')
    .get(getAllElders)
    .post(validators.createElder, validate, createElder);

router.route('/:id')
    .get(validators.mongoId, validate, getElderById)
    .put([...validators.mongoId, ...validators.updateElder], validate, updateElder)
    .delete(validators.mongoId, validate, deleteElder);

module.exports = router;