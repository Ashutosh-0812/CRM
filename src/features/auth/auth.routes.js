const express = require('express');
const router = express.Router();
const AuthController = require('./auth.controller');
const authMiddleware = require('../../middleware/authMiddleware');
const validate = require('../../middleware/validate');
const { registerValidation, loginValidation } = require('./auth.validator');

router.post('/register', validate(registerValidation), AuthController.register);

router.post('/login', validate(loginValidation), AuthController.login);

router.post('/refresh', AuthController.refreshToken);

router.get('/profile', authMiddleware, AuthController.getProfile);

router.post('/logout', authMiddleware, AuthController.logout);

module.exports = router;
