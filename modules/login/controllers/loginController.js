const LoginService = require('../services/loginService');
const LoginTokenService = require('../services/loginTokenService');
const Response = require('../../../responses/responses');
const { asyncHandler } = require('../../../middlewares/errorHandler');

class LoginController {
  static login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Authenticate user
    const user = await LoginService.authenticateUser(email, password);

    // Generate tokens
    const { accessToken, refreshToken } = LoginTokenService.generateTokens(user);

    // Save refresh token
    await LoginTokenService.saveRefreshToken(user.id, refreshToken);

    // Set cookies
    LoginTokenService.setTokenCookies(res, accessToken, refreshToken);

    Response.success(res, {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        is_verified: user.is_verified
      }
    }, 'Login successful');
  });

  static getProfile = asyncHandler(async (req, res) => {
    const user = await LoginService.getUserProfile(req.user.id);
    Response.success(res, user, 'Profile retrieved successfully');
  });

  static refreshToken = asyncHandler(async (req, res) => {
    const { refreshToken } = req.cookies;

    // Validate refresh token
    const user = await LoginService.refreshUserToken(refreshToken);

    // Generate new tokens
    const { accessToken, refreshToken: newRefreshToken } = LoginTokenService.generateTokens(user);

    // Save new refresh token
    await LoginTokenService.saveRefreshToken(user.id, newRefreshToken);

    // Set new cookies
    LoginTokenService.setTokenCookies(res, accessToken, newRefreshToken);

    Response.success(res, {
      accessToken,
      refreshToken: newRefreshToken
    }, 'Token refreshed successfully');
  });

  static logout = asyncHandler(async (req, res) => {
    await LoginService.logoutUser(req.user.id);
    LoginTokenService.clearTokenCookies(res);
    Response.success(res, null, 'Logged out successfully');
  });

  // Admin endpoints
  static getAllUsers = asyncHandler(async (req, res) => {
    const users = await LoginService.getAllUsers();
    Response.success(res, users, 'Users retrieved successfully');
  });

  static verifyUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    await LoginService.verifyUser(id);
    Response.success(res, null, 'User verified successfully');
  });

  static deleteUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    await LoginService.deleteUser(id, req.user.id);
    Response.success(res, null, 'User deleted successfully');
  });
}

module.exports = LoginController;
