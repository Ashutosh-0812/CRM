const Customer = require('../models/Customer');
const { AppError } = require('../middleware/errorHandler');
const logger = require('../utils/logger');

class CustomerController {
  // Create new customer
  static async createCustomer(req, res, next) {
    try {
      const { name, email, phone, company, address, status } = req.body;

      const customerId = await Customer.create({
        name,
        email,
        phone,
        company,
        address,
        status,
        created_by: req.user.id
      });

      logger.info(`Customer created: ${customerId} by user ${req.user.id}`);

      res.status(201).json({
        success: true,
        message: 'Customer created successfully',
        data: { customerId }
      });
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        return next(new AppError('Customer with this email already exists', 400));
      }
      next(error);
    }
  }

  // Get all customers with pagination and search
  static async getAllCustomers(req, res, next) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const search = req.query.search || '';

      const result = await Customer.findAll(page, limit, search);

      logger.info(`Fetched ${result.data.length} customers (page ${page})`);

      res.status(200).json({
        success: true,
        ...result
      });
    } catch (error) {
      next(error);
    }
  }

  // Get single customer by ID
  static async getCustomerById(req, res, next) {
    try {
      const { id } = req.params;

      const customer = await Customer.findById(id);
      
      if (!customer) {
        throw new AppError('Customer not found', 404);
      }

      res.status(200).json({
        success: true,
        data: customer
      });
    } catch (error) {
      next(error);
    }
  }

  // Update customer
  static async updateCustomer(req, res, next) {
    try {
      const { id } = req.params;
      const { name, email, phone, company, address, status } = req.body;

      const affectedRows = await Customer.update(id, {
        name,
        email,
        phone,
        company,
        address,
        status
      });

      if (affectedRows === 0) {
        throw new AppError('Customer not found', 404);
      }

      logger.info(`Customer updated: ${id} by user ${req.user.id}`);

      res.status(200).json({
        success: true,
        message: 'Customer updated successfully'
      });
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        return next(new AppError('Customer with this email already exists', 400));
      }
      next(error);
    }
  }

  // Delete customer
  static async deleteCustomer(req, res, next) {
    try {
      const { id } = req.params;

      const affectedRows = await Customer.delete(id);

      if (affectedRows === 0) {
        throw new AppError('Customer not found', 404);
      }

      logger.info(`Customer deleted: ${id} by user ${req.user.id}`);

      res.status(200).json({
        success: true,
        message: 'Customer deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = CustomerController;
