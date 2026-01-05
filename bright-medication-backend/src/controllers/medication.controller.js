// ============================================
// FILE: src/controllers/medication.controller.js
// ============================================
const Medication = require('../models/Medication');
const Elder = require('../models/Elder');

// @desc    Get all medications for an elder
// @route   GET /api/medications/elder/:elderId
// @access  Private
exports.getMedicationsByElder = async (req, res) => {
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

        const medications = await Medication.find({ elderId: req.params.elderId })
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: medications.length,
            data: medications
        });
    } catch (error) {
        console.error('Get medications error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching medications',
            error: error.message
        });
    }
};

// @desc    Get single medication
// @route   GET /api/medications/:id
// @access  Private
exports.getMedicationById = async (req, res) => {
    try {
        const medication = await Medication.findById(req.params.id).populate('elderId');

        if (!medication) {
            return res.status(404).json({
                success: false,
                message: 'Medication not found'
            });
        }

        // Verify elder belongs to caregiver
        if (medication.elderId.caregiverId.toString() !== req.caregiver._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to access this medication'
            });
        }

        res.status(200).json({
            success: true,
            data: medication
        });
    } catch (error) {
        console.error('Get medication error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching medication',
            error: error.message
        });
    }
};

// @desc    Create new medication
// @route   POST /api/medications
// @access  Private
exports.createMedication = async (req, res) => {
    try {
        // Verify elder belongs to caregiver
        const elder = await Elder.findOne({
            _id: req.body.elderId,
            caregiverId: req.caregiver._id
        });

        if (!elder) {
            return res.status(404).json({
                success: false,
                message: 'Elder not found or not authorized'
            });
        }

        const medication = await Medication.create(req.body);

        res.status(201).json({
            success: true,
            message: 'Medication created successfully',
            data: medication
        });
    } catch (error) {
        console.error('Create medication error:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating medication',
            error: error.message
        });
    }
};

// @desc    Update medication
// @route   PUT /api/medications/:id
// @access  Private
exports.updateMedication = async (req, res) => {
    try {
        let medication = await Medication.findById(req.params.id).populate('elderId');

        if (!medication) {
            return res.status(404).json({
                success: false,
                message: 'Medication not found'
            });
        }

        // Verify elder belongs to caregiver
        if (medication.elderId.caregiverId.toString() !== req.caregiver._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this medication'
            });
        }

        medication = await Medication.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            message: 'Medication updated successfully',
            data: medication
        });
    } catch (error) {
        console.error('Update medication error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating medication',
            error: error.message
        });
    }
};

// @desc    Delete medication
// @route   DELETE /api/medications/:id
// @access  Private
exports.deleteMedication = async (req, res) => {
    try {
        const medication = await Medication.findById(req.params.id).populate('elderId');

        if (!medication) {
            return res.status(404).json({
                success: false,
                message: 'Medication not found'
            });
        }

        // Verify elder belongs to caregiver
        if (medication.elderId.caregiverId.toString() !== req.caregiver._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to delete this medication'
            });
        }

        await Medication.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: 'Medication deleted successfully'
        });
    } catch (error) {
        console.error('Delete medication error:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting medication',
            error: error.message
        });
    }
};