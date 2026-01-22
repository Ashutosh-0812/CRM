const express = require('express');
const router = express.Router();
const LeadController = require('./lead.controller');
const authMiddleware = require('../../middleware/authMiddleware');
const validate = require('../../middleware/validate');
const { createLeadValidation, updateLeadValidation } = require('./lead.validator');

router.use(authMiddleware);

//  POST /api/leads

router.post('/', validate(createLeadValidation), LeadController.createLead);

//   GET /api/leads

router.get('/', LeadController.getAllLeads);

//   GET /api/leads/:id

router.get('/:id', LeadController.getLeadById);

//   PUT /api/leads/:id
router.put('/:id', validate(updateLeadValidation), LeadController.updateLead);

// DELETE /api/leads/:id

router.delete('/:id', LeadController.deleteLead);

module.exports = router;
