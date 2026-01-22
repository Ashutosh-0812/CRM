const { AppError } = require('./errorHandler');

// Middleware to check if user is verified
const checkVerified = (req, res, next) => {
  // Admins bypass verification check
  if (req.user.role === 'admin') {
    return next();
  }
  
  if (!req.user.is_verified) {
    throw new AppError('Your account is not verified. Please contact admin.', 403);
  }
  next();
};

// Middleware to check if user has required role(s)
const checkRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      throw new AppError('Access denied. No role found.', 403);
    }

    if (!allowedRoles.includes(req.user.role)) {
      throw new AppError('Access denied. Insufficient permissions.', 403);
    }

    next();
  };
};

// Middleware to check if user is admin
const isAdmin = checkRole('admin');

// Middleware to check ownership or admin
const checkOwnershipOrAdmin = (getOwnerId) => {
  return async (req, res, next) => {
    try {
      // Admins can access everything
      if (req.user.role === 'admin') {
        return next();
      }

      // Get the owner ID of the resource
      const ownerId = await getOwnerId(req);

      // Check if the user is the owner
      if (ownerId !== req.user.id) {
        throw new AppError('Access denied. You can only manage your own resources.', 403);
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

module.exports = {
  checkVerified,
  checkRole,
  isAdmin,
  checkOwnershipOrAdmin
};
