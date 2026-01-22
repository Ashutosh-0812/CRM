const express = require('express');
const router = express.Router();
const AuthController = require('./auth.controller');
const authMiddleware = require('../../middleware/authMiddleware');
const { isAdmin } = require('../../middleware/roleMiddleware');
const validate = require('../../middleware/validate');
const { registerValidation, loginValidation } = require('./auth.validator');

router.post('/register', validate(registerValidation), AuthController.register);

router.post('/login', validate(loginValidation), AuthController.login);

router.post('/refresh', AuthController.refreshToken);

router.get('/profile', authMiddleware, AuthController.getProfile);

router.post('/logout', authMiddleware, AuthController.logout);

// Admin-only routes
router.get('/users', authMiddleware, isAdmin, AuthController.getAllUsers);

router.patch('/users/:id/verify', authMiddleware, isAdmin, AuthController.verifyUser);

router.delete('/users/:id', authMiddleware, isAdmin, AuthController.deleteUser);

module.exports = router;
