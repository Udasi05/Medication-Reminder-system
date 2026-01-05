// ============================================
// FILE: src/controllers/elder.controller.js
// ============================================
const Elder = require('../models/Elder');
const Medication = require('../models/Medication');

// @desc    Get all elders for logged in caregiver
// @route   GET /api/elders
// @access  Private
exports.getAllElders = async (req, res) => {
    try {
        const elders = await Elder.find({ caregiverId: req.caregiver._id })
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: elders.length,
            data: elders
        });
    } catch (error) {
        console.error('Get elders error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching elders',
            error: error.message
        });
    }
};

// @desc    Get single elder
// @route   GET /api/elders/:id
// @access  Private
exports.getElderById = async (req, res) => {
    try {
        const elder = await Elder.findOne({
            _id: req.params.id,
            caregiverId: req.caregiver._id
        });

        if (!elder) {
            return res.status(404).json({
                success: false,
                message: 'Elder not found'
            });
        }

        res.status(200).json({
            success: true,
            data: elder
        });
    } catch (error) {
        console.error('Get elder error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching elder',
            error: error.message
        });
    }
};

// @desc    Create new elder
// @route   POST /api/elders
// @access  Private
exports.createElder = async (req, res) => {
    try {
        const elderData = {
            ...req.body,
            caregiverId: req.caregiver._id
        };

        const elder = await Elder.create(elderData);

        res.status(201).json({
            success: true,
            message: 'Elder created successfully',
            data: elder
        });
    } catch (error) {
        console.error('Create elder error:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating elder',
            error: error.message
        });
    }
};

// @desc    Update elder
// @route   PUT /api/elders/:id
// @access  Private
exports.updateElder = async (req, res) => {
    try {
        let elder = await Elder.findOne({
            _id: req.params.id,
            caregiverId: req.caregiver._id
        });

        if (!elder) {
            return res.status(404).json({
                success: false,
                message: 'Elder not found'
            });
        }

        elder = await Elder.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            message: 'Elder updated successfully',
            data: elder
        });
    } catch (error) {
        console.error('Update elder error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating elder',
            error: error.message
        });
    }
};

// @desc    Delete elder
// @route   DELETE /api/elders/:id
// @access  Private
exports.deleteElder = async (req, res) => {
    try {
        const elder = await Elder.findOne({
            _id: req.params.id,
            caregiverId: req.caregiver._id
        });

        if (!elder) {
            return res.status(404).json({
                success: false,
                message: 'Elder not found'
            });
        }

        // Delete all medications for this elder
        await Medication.deleteMany({ elderId: elder._id });

        await Elder.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: 'Elder and associated medications deleted successfully'
        });
    } catch (error) {
        console.error('Delete elder error:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting elder',
            error: error.message
        });
    }
};





