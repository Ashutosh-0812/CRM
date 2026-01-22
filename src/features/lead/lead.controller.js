const Lead = require('./lead.model');
const { AppError } = require('../../middleware/errorHandler');

class LeadController {
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
        assigned_to,
        created_by: req.user.id
      });

      res.status(201).json({
        success: true,
        message: 'Lead created successfully',
        data: { leadId }
      });
    } catch (error) {
      res.status(201).json({
        success :false,
        message : 'internal server error ',

      })
      next();
    }
  }

 
  static async getAllLeads(req, res, next) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const search = req.query.search || '';
      const status = req.query.status || '';

      const result = await Lead.findAll(page, limit, search, status);

      res.status(200).json({
        success: true,
        ...result
      });
    } catch (error) {
      next(error);
    }
  }

 
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

      res.status(200).json({
        success: true,
        message: 'Lead updated successfully'
      });
    } catch (error) {
      next(error);
    }
  }


  static async deleteLead(req, res, next) {
    try {
      const { id } = req.params;

      // Check ownership if not admin
      if (req.user.role !== 'admin') {
        const lead = await Lead.findById(id);
        if (!lead) {
          throw new AppError('Lead not found', 404);
        }
        if (lead.created_by !== req.user.id) {
          throw new AppError('Access denied. You can only delete your own leads.', 403);
        }
      }

      const affectedRows = await Lead.delete(id);

      if (affectedRows === 0) {
        throw new AppError('Lead not found', 404);
      }

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
