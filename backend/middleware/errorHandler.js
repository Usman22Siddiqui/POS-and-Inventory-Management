/**
 * Centralized error handling middleware.
 * All errors flow through here for consistent JSON responses.
 */

class AppError extends Error {
  constructor(message, statusCode, errors = null) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    this.isOperational = true;
  }
}

const errorHandler = (err, req, res, next) => {
  // Default to 500 if no status code set
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';

  // Sequelize validation errors
  if (err.name === 'SequelizeValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: err.errors.map(e => ({
        field: e.path,
        message: e.message,
      })),
    });
  }

  // Sequelize unique constraint errors
  if (err.name === 'SequelizeUniqueConstraintError') {
    return res.status(409).json({
      success: false,
      message: 'A record with this value already exists',
      errors: err.errors.map(e => ({
        field: e.path,
        message: `${e.path} must be unique — "${e.value}" is already taken`,
      })),
    });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Invalid authentication token',
      error: null,
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Authentication token has expired — please log in again',
      error: null,
    });
  }

  // Operational errors (ones we threw intentionally)
  if (err.isOperational) {
    return res.status(statusCode).json({
      success: false,
      message,
      errors: err.errors,
    });
  }

  // Unknown/unexpected errors — log full error in dev
  console.error('Unhandled server error:', err);

  return res.status(500).json({
    success: false,
    message: err.message || 'Something went wrong on our end',
    error: err.message,
  });
};

module.exports = { errorHandler, AppError };
