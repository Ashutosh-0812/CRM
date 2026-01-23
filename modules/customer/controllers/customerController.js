const CustomerService = require('../services/customerService');
const Response = require('../../../responses/responses');
const { asyncHandler } = require('../../../middlewares/errorHandler');

class CustomerController {
  static createCustomer = asyncHandler(async (req, res) => {
    const { name, email, phone, company, address, status } = req.body;

    const result = await CustomerService.createCustomer(
      { name, email, phone, company, address, status },
      req.user.id
    );

    Response.created(res, result, 'Customer created successfully');
  });

  static getAllCustomers = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';

    const result = await CustomerService.getAllCustomers(page, limit, search);

    Response.paginated(res, result.data, result.pagination, 'Customers retrieved successfully');
  });

  static getCustomerById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const customer = await CustomerService.getCustomerById(id);

    Response.success(res, customer, 'Customer retrieved successfully');
  });

  static updateCustomer = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { name, email, phone, company, address, status } = req.body;

    await CustomerService.updateCustomer(id, {
      name, email, phone, company, address, status
    });

    Response.success(res, null, 'Customer updated successfully');
  });

  static deleteCustomer = asyncHandler(async (req, res) => {
    const { id } = req.params;

    await CustomerService.deleteCustomer(id);

    Response.success(res, null, 'Customer deleted successfully');
  });
}

module.exports = CustomerController;
