const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('./auth.model');
const { AppError } = require('../../middleware/errorHandler');

class AuthController {
  static generateTokens(user) {
    const accessToken = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '15m' }
    );

    const refreshToken = crypto.randomBytes(64).toString('hex');

    return { accessToken, refreshToken };
  }

  static setTokenCookies(res, accessToken, refreshToken) {
    res.cookie('accessToken', accessToken, {
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000 // 15 minutes
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });
  }

  static async register(req, res, next) {
    try {
      const { name, email, password, role } = req.body;

      const existingUser = await User.findByEmail(email);
      if (existingUser) {
        throw new AppError('User with this email already exists', 400);
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const userId = await User.create({
        name,
        email,
        password: hashedPassword,
        role: role || 'user'
      });

      const { accessToken, refreshToken } = AuthController.generateTokens({
        id: userId,
        email,
        role: role || 'user'
      });

      await User.saveRefreshToken(userId, refreshToken);

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

  static async login(req, res, next) {
    try {
      const { email, password } = req.body;

      const user = await User.findByEmail(email);
      if (!user) {
        throw new AppError('Invalid credentials', 401);
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new AppError('Invalid credentials', 401);
      }

      const { accessToken, refreshToken } = AuthController.generateTokens(user);

      await User.saveRefreshToken(user.id, refreshToken);

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

  static async refreshToken(req, res, next) {
    try {
      const { refreshToken } = req.cookies;

      if (!refreshToken) {
        throw new AppError('Refresh token not provided', 401);
      }

      const user = await User.findByRefreshToken(refreshToken);
      if (!user) {
        throw new AppError('Invalid refresh token', 401);
      }

      const { accessToken, refreshToken: newRefreshToken } = AuthController.generateTokens(user);

      await User.saveRefreshToken(user.id, newRefreshToken);

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

  static async logout(req, res, next) {
    try {
      await User.clearRefreshToken(req.user.id);

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
