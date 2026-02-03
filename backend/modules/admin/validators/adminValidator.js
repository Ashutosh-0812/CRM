const Joi = require('joi');

const verifyUserValidation = {
    body: Joi.object({
        action: Joi.string().valid('approve', 'reject').required().messages({
            'any.only': 'Action must be either approve or reject',
            'any.required': 'Action is required'
        })
    })
};

const updateRoleValidation = {
    body: Joi.object({
        role: Joi.string().valid('admin', 'user').required().messages({
            'any.only': 'Role must be either admin or user',
            'any.required': 'Role is required'
        })
    })
};

const userIdValidation = {
    params: Joi.object({
        id: Joi.number().integer().positive().required().messages({
            'number.base': 'User ID must be a number',
            'number.integer': 'User ID must be an integer',
            'number.positive': 'User ID must be positive',
            'any.required': 'User ID is required'
        })
    })
};

module.exports = {
    verifyUserValidation,
    updateRoleValidation,
    userIdValidation
};