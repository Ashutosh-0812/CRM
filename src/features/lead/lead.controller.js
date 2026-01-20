const Lead = require('./lead.model');
const { AppError } = require('../../middleware/errorHandler');
const logger = require('../../utils/logger');

class LeadController {
  // Create new lead
  static async createLead(req, res, next) {
    try {
      const { name, email, phone, company, source, status, notes, assigned_to } = req.body;

      const leadId = await Lead.create({
        name,
        email,
        phone,
        company,
        source,
        status,
        notes,
        assigned_to
      });

      logger.info(`Lead created: ${leadId} by user ${req.user.id}`);

      res.status(201).json({
        success: true,
        message: 'Lead created successfully',
        data: { leadId }
      });
    } catch (error) {
      next(error);
    }
  }

  // Get all leads with pagination, search, and status filter
  static async getAllLeads(req, res, next) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const search = req.query.search || '';
      const status = req.query.status || '';

      const result = await Lead.findAll(page, limit, search, status);

      logger.info(`Fetched ${result.data.length} leads (page ${page})`);

      res.status(200).json({
        success: true,
        ...result
      });
    } catch (error) {
      next(error);
    }
  }

  // Get single lead by ID
  static async getLeadById(req, res, next) {
    try {
      const { id } = req.params;

      const lead = await Lead.findById(id);
      
      if (!lead) {
        throw new AppError('Lead not found', 404);
      }

      res.status(200).json({
        success: true,
        data: lead
      });
    } catch (error) {
      next(error);
    }
  }

  // Update lead
  static async updateLead(req, res, next) {
    try {
      const { id } = req.params;
      const { name, email, phone, company, source, status, notes, assigned_to } = req.body;

      const affectedRows = await Lead.update(id, {
        name,
        email,
        phone,
        company,
        source,
        status,
        notes,
        assigned_to
      });

      if (affectedRows === 0) {
        throw new AppError('Lead not found', 404);
      }

      logger.info(`Lead updated: ${id} by user ${req.user.id}`);

      res.status(200).json({
        success: true,
        message: 'Lead updated successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  // Delete lead
  static async deleteLead(req, res, next) {
    try {
      const { id } = req.params;

      const affectedRows = await Lead.delete(id);

      if (affectedRows === 0) {
        throw new AppError('Lead not found', 404);
      }

      logger.info(`Lead deleted: ${id} by user ${req.user.id}`);

      res.status(200).json({
        success: true,
        message: 'Lead deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = LeadController;
