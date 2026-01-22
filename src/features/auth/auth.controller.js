const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('./auth.model');
const { AppError } = require('../../middleware/errorHandler');

class AuthController {
  // Helper to generate tokens
  static generateTokens(user) {
    const accessToken = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '15m' }
    );

    const refreshToken = crypto.randomBytes(64).toString('hex');

    return { accessToken, refreshToken };
  }

  // Helper to set cookies
  static setTokenCookies(res, accessToken, refreshToken) {
    // Access token cookie - short lived
    res.cookie('accessToken', accessToken, {
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000 // 15 minutes
    });

    // Refresh token cookie - long lived
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });
  }
  // Register new user
  static async register(req, res, next) {
    try {
      const { name, email, password, role } = req.body;

      // Check if user already exists
      const existingUser = await User.findByEmail(email);
      if (existingUser) {
        throw new AppError('User with this email already exists', 400);
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user
      const userId = await User.create({
        name,
        email,
        password: hashedPassword,
        role: role || 'user'
      });

      // Generate tokens
      const { accessToken, refreshToken } = AuthController.generateTokens({
        id: userId,
        email,
        role: role || 'user'
      });

      // Save refresh token to database
      await User.saveRefreshToken(userId, refreshToken);

      // Set cookies
      AuthController.setTokenCookies(res, accessToken, refreshToken);

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: { 
          userId, 
          email,
          accessToken,
          refreshToken
        }
      });
    } catch (error) {
      next(error);
    }
  }

  // Login user
  static async login(req, res, next) {
    try {
      const { email, password } = req.body;

      // Find user
      const user = await User.findByEmail(email);
      if (!user) {
        throw new AppError('Invalid credentials', 401);
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new AppError('Invalid credentials', 401);
      }

      // Generate tokens
      const { accessToken, refreshToken } = AuthController.generateTokens(user);

      // Save refresh token to database
      await User.saveRefreshToken(user.id, refreshToken);

      // Set cookies
      AuthController.setTokenCookies(res, accessToken, refreshToken);

      res.status(200).json({
        success: true,
        message: 'Login successful',
        data: {
          accessToken,
          refreshToken,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
          }
        }
      });
    } catch (error) {
      next(error);
    }
  }

  // Get current user profile
  static async getProfile(req, res, next) {
    try {
      const user = await User.findById(req.user.id);
      
      if (!user) {
        throw new AppError('User not found', 404);
      }

      res.status(200).json({
        success: true,
        data: user
      });
    } catch (error) {
      next(error);
    }
  }

  // Refresh access token
  static async refreshToken(req, res, next) {
    try {
      const { refreshToken } = req.cookies;

      if (!refreshToken) {
        throw new AppError('Refresh token not provided', 401);
      }

      // Find user by refresh token
      const user = await User.findByRefreshToken(refreshToken);
      if (!user) {
        throw new AppError('Invalid refresh token', 401);
      }

      // Generate new tokens
      const { accessToken, refreshToken: newRefreshToken } = AuthController.generateTokens(user);

      // Update refresh token in database
      await User.saveRefreshToken(user.id, newRefreshToken);

      // Set new cookies
      AuthController.setTokenCookies(res, accessToken, newRefreshToken);

      res.status(200).json({
        success: true,
        message: 'Token refreshed successfully',
        data: {
          accessToken,
          refreshToken: newRefreshToken
        }
      });
    } catch (error) {
      next(error);
    }
  }

  // Logout user
  static async logout(req, res, next) {
    try {
      // Clear refresh token from database
      await User.clearRefreshToken(req.user.id);

      // Clear cookies
      res.clearCookie('accessToken');
      res.clearCookie('refreshToken');

      res.status(200).json({
        success: true,
        message: 'Logged out successfully'
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = AuthController;
