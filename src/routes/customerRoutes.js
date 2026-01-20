const express = require('express');
const router = express.Router();
const CustomerController = require('../controllers/customerController');
const authMiddleware = require('../middleware/authMiddleware');
const validate = require('../middleware/validate');
const { createCustomerValidation, updateCustomerValidation } = require('../validators/customerValidator');

// All customer routes require authentication
router.use(authMiddleware);

// @route   POST /api/customers
// @desc    Create a new customer
// @access  Private
router.post('/', createCustomerValidation, validate, CustomerController.createCustomer);

// @route   GET /api/customers
// @desc    Get all customers with pagination and search
// @access  Private
// Query params: page, limit, search
router.get('/', CustomerController.getAllCustomers);

// @route   GET /api/customers/:id
// @desc    Get customer by ID
// @access  Private
router.get('/:id', CustomerController.getCustomerById);

// @route   PUT /api/customers/:id
// @desc    Update customer
// @access  Private
router.put('/:id', updateCustomerValidation, validate, CustomerController.updateCustomer);

// @route   DELETE /api/customers/:id
// @desc    Delete customer
// @access  Private
router.delete('/:id', CustomerController.deleteCustomer);

module.exports = router;
