const LeadService = require('../services/leadService');
const Response = require('../../../responses/responses');
const { asyncHandler } = require('../../../middlewares/errorHandler');

class LeadController {
  static createLead = asyncHandler(async (req, res) => {
    const { name, email, phone, company, source, status, notes, assigned_to } = req.body;

    const result = await LeadService.createLead(
      { name, email, phone, company, source, status, notes, assigned_to },
      req.user.id
    );

    Response.created(res, result, 'Lead created successfully');
  });

  static getAllLeads = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const status = req.query.status || '';

    const result = await LeadService.getAllLeads(page, limit, search, status);

    Response.paginated(res, result.data, result.pagination, 'Leads retrieved successfully');
  });

  static getLeadById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const lead = await LeadService.getLeadById(id);

    Response.success(res, lead, 'Lead retrieved successfully');
  });

  static updateLead = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { name, email, phone, company, source, status, notes, assigned_to } = req.body;

    await LeadService.updateLead(id, {
      name, email, phone, company, source, status, notes, assigned_to
    });

    Response.success(res, null, 'Lead updated successfully');
  });

  static deleteLead = asyncHandler(async (req, res) => {
    const { id } = req.params;

    await LeadService.deleteLead(id);

    Response.success(res, null, 'Lead deleted successfully');
  });
}

module.exports = LeadController;
