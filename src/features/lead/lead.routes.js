const express = require('express');
const router = express.Router();
const LeadController = require('./lead.controller');
const authMiddleware = require('../../middleware/authMiddleware');
const validate = require('../../middleware/validate');
const { createLeadValidation, updateLeadValidation } = require('./lead.validator');

router.use(authMiddleware);

router.post('/', validate(createLeadValidation), LeadController.createLead);

router.get('/', LeadController.getAllLeads);

router.get('/:id', LeadController.getLeadById);

router.put('/:id', validate(updateLeadValidation), LeadController.updateLead);

router.delete('/:id', LeadController.deleteLead);

module.exports = router;
