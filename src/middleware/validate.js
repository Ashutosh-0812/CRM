const { validationResult } = require('express-validator');
const { AppError } = require('./errorHandler');

const validate = (validations) => {
  return async (req, res, next) => {
   
    if (validations && validations.length > 0) {
      for (let validation of validations) {
        await validation.run(req);
      }
    }
    
    // Check for errors
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
      const errorMessages = errors.array().map(err => ({
        field: err.path || err.param,
        message: err.msg
      }));
      
      return next(new AppError(JSON.stringify(errorMessages), 400));
    }
    
    next();
  };
};

module.exports = validate;
