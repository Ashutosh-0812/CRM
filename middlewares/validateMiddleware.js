const { validationResult } = require('express-validator');
const Response = require('../responses/responses');

const validate = (validations) => {
  return async (req, res, next) => {
    // Execute all validations
    for (let validation of validations) {
      const result = await validation.run(req);
    }

    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const formattedErrors = errors.array().map(err => ({
        field: err.path || err.param,
        message: err.msg
      }));

      return Response.validationError(res, formattedErrors);
    }

    next();
  };
};

module.exports = validate;
