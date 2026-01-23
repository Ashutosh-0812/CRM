const express = require('express');
const router = express.Router();
const LoginController = require('./controllers/loginController');
const { authMiddleware, isAdmin, validate } = require('../../middlewares');
const { loginValidation } = require('./validators/loginValidator');

// Public routes
router.post('/login', validate(loginValidation), LoginController.login);
router.post('/refresh', LoginController.refreshToken);

// Protected routes
router.get('/profile', authMiddleware, LoginController.getProfile);
router.post('/logout', authMiddleware, LoginController.logout);

// Admin routes
router.get('/users', authMiddleware, isAdmin, LoginController.getAllUsers);
router.patch('/users/:id/verify', authMiddleware, isAdmin, LoginController.verifyUser);
router.delete('/users/:id', authMiddleware, isAdmin, LoginController.deleteUser);

module.exports = router;
