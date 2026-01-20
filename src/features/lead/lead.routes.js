const express = require('express');
const router = express.Router();
const LeadController = require('./lead.controller');
const authMiddleware = require('../../middleware/authMiddleware');
const validate = require('../../middleware/validate');
const { createLeadValidation, updateLeadValidation } = require('./lead.validator');

// All lead routes require authentication
router.use(authMiddleware);

// @route   POST /api/leads
// @desc    Create a new lead
// @access  Private
router.post('/', createLeadValidation, validate, LeadController.createLead);

// @route   GET /api/leads
// @desc    Get all leads with pagination, search, and status filter
// @access  Private
// Query params: page, limit, search, status
router.get('/', LeadController.getAllLeads);

// @route   GET /api/leads/:id
// @desc    Get lead by ID
// @access  Private
router.get('/:id', LeadController.getLeadById);

// @route   PUT /api/leads/:id
// @desc    Update lead
// @access  Private
router.put('/:id', updateLeadValidation, validate, LeadController.updateLead);

// @route   DELETE /api/leads/:id
// @desc    Delete lead
// @access  Private
router.delete('/:id', LeadController.deleteLead);

module.exports = router;
