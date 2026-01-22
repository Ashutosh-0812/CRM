const express = require('express');
const router = express.Router();
const AuthController = require('./auth.controller');
const authMiddleware = require('../../middleware/authMiddleware');
const validate = require('../../middleware/validate');
const { registerValidation, loginValidation } = require('./auth.validator');

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', validate(registerValidation), AuthController.register);

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', validate(loginValidation), AuthController.login);

// @route   POST /api/auth/refresh
// @desc    Refresh access token
// @access  Public
router.post('/refresh', AuthController.refreshToken);

// @route   GET /api/auth/profile
// @desc    Get current user profile
// @access  Private
router.get('/profile', authMiddleware, AuthController.getProfile);

// @route   POST /api/auth/logout
// @desc    Logout user
// @access  Private
router.post('/logout', authMiddleware, AuthController.logout);

module.exports = router;
