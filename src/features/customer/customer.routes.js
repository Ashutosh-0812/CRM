const express = require('express');
const router = express.Router();
const CustomerController = require('./customer.controller');
const authMiddleware = require('../../middleware/authMiddleware');
const validate = require('../../middleware/validate');
const { createCustomerValidation, updateCustomerValidation } = require('./customer.validator');

router.use(authMiddleware);

router.post('/', validate(createCustomerValidation), CustomerController.createCustomer);

router.get('/', CustomerController.getAllCustomers);

router.get('/:id', CustomerController.getCustomerById);

router.put('/:id', validate(updateCustomerValidation), CustomerController.updateCustomer);

router.delete('/:id', CustomerController.deleteCustomer);

module.exports = router;
