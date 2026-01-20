const { body } = require('express-validator');

const createCustomerValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 255 }).withMessage('Name must be between 2 and 255 characters'),
  
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email')
    .normalizeEmail(),
  
  body('phone')
    .optional()
    .trim()
    .isLength({ max: 50 }).withMessage('Phone number must not exceed 50 characters'),
  
  body('company')
    .optional()
    .trim()
    .isLength({ max: 255 }).withMessage('Company name must not exceed 255 characters'),
  
  body('address')
    .optional()
    .trim(),
  
  body('status')
    .optional()
    .isIn(['active', 'inactive']).withMessage('Status must be either active or inactive')
];

const updateCustomerValidation = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 255 }).withMessage('Name must be between 2 and 255 characters'),
  
  body('email')
    .optional()
    .trim()
    .isEmail().withMessage('Please provide a valid email')
    .normalizeEmail(),
  
  body('phone')
    .optional()
    .trim()
    .isLength({ max: 50 }).withMessage('Phone number must not exceed 50 characters'),
  
  body('company')
    .optional()
    .trim()
    .isLength({ max: 255 }).withMessage('Company name must not exceed 255 characters'),
  
  body('address')
    .optional()
    .trim(),
  
  body('status')
    .optional()
    .isIn(['active', 'inactive']).withMessage('Status must be either active or inactive')
];

module.exports = {
  createCustomerValidation,
  updateCustomerValidation
};
