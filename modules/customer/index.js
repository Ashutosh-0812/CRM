const express = require('express');
const router = express.Router();
const CustomerController = require('./controllers/customerController');
const { authMiddleware, checkVerified, validate } = require('../../middlewares');
const { createCustomerValidation, updateCustomerValidation } = require('./validators/customerValidator');

// All customer routes require authentication and verification
router.use(authMiddleware);
router.use(checkVerified);

// Customer routes
router.post('/', validate(createCustomerValidation), CustomerController.createCustomer);
router.get('/', CustomerController.getAllCustomers);
router.get('/:id', CustomerController.getCustomerById);
router.put('/:id', validate(updateCustomerValidation), CustomerController.updateCustomer);
router.delete('/:id', CustomerController.deleteCustomer);

module.exports = router;
