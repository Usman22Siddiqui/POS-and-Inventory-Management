const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { AppError } = require('./errorHandler');

/**
 * requireAuth — verifies the JWT from the Authorization header
 * and attaches the full user object to req.user
 */
const requireAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('No authentication token provided — please log in', 401);
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findByPk(decoded.id);
    if (!user) {
      throw new AppError('User account no longer exists', 401);
    }

    if (!user.is_active) {
      throw new AppError('Your account has been deactivated — contact an administrator', 403);
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.isOperational) {
      return next(error);
    }
    // JWT verification errors
    return next(error);
  }
};

/**
 * requireRole — restricts access to specified roles.
 * Must be used AFTER requireAuth.
 * 
 * Usage: requireRole(['admin', 'inventory_manager'])
 */
const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new AppError('Authentication required', 401));
    }

    if (!roles.includes(req.user.role)) {
      return next(new AppError(
        `Access denied — this action requires ${roles.join(' or ')} privileges`,
        403
      ));
    }

    next();
  };
};

module.exports = { requireAuth, requireRole };
