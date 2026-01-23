const { body } = require('express-validator');

const createLeadValidation = [
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
  
  body('source')
    .optional()
    .trim()
    .isLength({ max: 100 }).withMessage('Source must not exceed 100 characters'),
  
  body('status')
    .optional()
    .isIn(['new', 'contacted', 'qualified', 'converted', 'lost'])
    .withMessage('Invalid status'),
  
  body('notes')
    .optional()
    .trim(),
  
  body('assigned_to')
    .optional()
    .isInt({ min: 1 }).withMessage('Assigned to must be a valid user ID')
];

const updateLeadValidation = [
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
  
  body('source')
    .optional()
    .trim()
    .isLength({ max: 100 }).withMessage('Source must not exceed 100 characters'),
  
  body('status')
    .optional()
    .isIn(['new', 'contacted', 'qualified', 'converted', 'lost'])
    .withMessage('Invalid status'),
  
  body('notes')
    .optional()
    .trim(),
  
  body('assigned_to')
    .optional()
    .isInt({ min: 1 }).withMessage('Assigned to must be a valid user ID')
];

module.exports = {
  createLeadValidation,
  updateLeadValidation
};
