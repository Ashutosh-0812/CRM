const { body, param, query } = require('express-validator');

// Common validators
const idValidator = () => param('id').isInt({ min: 1 }).withMessage('Invalid ID');

const emailValidator = () => body('email').isEmail().withMessage('Invalid email address').normalizeEmail();

const passwordValidator = () => body('password')
  .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
  .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
  .matches(/[a-z]/).withMessage('Password must contain at least one lowercase letter')
  .matches(/\d/).withMessage('Password must contain at least one number')
  .matches(/[!@#$%^&*(),.?":{}|<>]/).withMessage('Password must contain at least one special character');

const nameValidator = (field = 'name') => body(field)
  .trim()
  .notEmpty().withMessage(`${field} is required`)
  .isLength({ min: 2, max: 255 }).withMessage(`${field} must be between 2 and 255 characters`);

const phoneValidator = (field = 'phone') => body(field)
  .optional()
  .matches(/^[\d\s\-\+\(\)]+$/).withMessage('Invalid phone number format');

const paginationValidator = () => [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('search').optional().trim().isLength({ max: 255 }).withMessage('Search query too long')
];

module.exports = {
  idValidator,
  emailValidator,
  passwordValidator,
  nameValidator,
  phoneValidator,
  paginationValidator
};
