const express = require('express');
const router = express.Router();
const AuthController = require('./auth.controller');
const authMiddleware = require('../../middleware/authMiddleware');
const validate = require('../../middleware/validate');
const { registerValidation, loginValidation } = require('./auth.validator');

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', registerValidation, validate, AuthController.register);

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', loginValidation, validate, AuthController.login);

// @route   GET /api/auth/profile
// @desc    Get current user profile
// @access  Private
router.get('/profile', authMiddleware, AuthController.getProfile);

module.exports = router;
