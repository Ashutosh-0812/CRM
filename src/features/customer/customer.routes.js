const express = require('express');
const router = express.Router();
const CustomerController = require('./customer.controller');
const authMiddleware = require('../../middleware/authMiddleware');
const { checkRole, checkVerified } = require('../../middleware/roleMiddleware');
const validate = require('../../middleware/validate');
const { createCustomerValidation, updateCustomerValidation } = require('./customer.validator');

router.use(authMiddleware);
router.use(checkVerified);

// Both admin and user can create and view customers
router.post('/', validate(createCustomerValidation), CustomerController.createCustomer);

router.get('/', CustomerController.getAllCustomers);

router.get('/:id', CustomerController.getCustomerById);

// Both admin and user can update (admin can update any, user can update their own)
router.put('/:id', validate(updateCustomerValidation), CustomerController.updateCustomer);

// Both admin and user can delete (admin can delete any, user can delete their own)
router.delete('/:id', CustomerController.deleteCustomer);

module.exports = router;
