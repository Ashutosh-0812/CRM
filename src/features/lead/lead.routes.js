const express = require('express');
const router = express.Router();
const LeadController = require('./lead.controller');
const authMiddleware = require('../../middleware/authMiddleware');
const { checkRole, checkVerified } = require('../../middleware/roleMiddleware');
const validate = require('../../middleware/validate');
const { createLeadValidation, updateLeadValidation } = require('./lead.validator');

router.use(authMiddleware);
router.use(checkVerified);

// Both admin and user can create and view leads
router.post('/', validate(createLeadValidation), LeadController.createLead);

router.get('/', LeadController.getAllLeads);

router.get('/:id', LeadController.getLeadById);

// Both admin and user can update (admin can update any, user can update their own)
router.put('/:id', validate(updateLeadValidation), LeadController.updateLead);

// Both admin and user can delete (admin can delete any, user can delete their own)
router.delete('/:id', LeadController.deleteLead);

module.exports = router;
