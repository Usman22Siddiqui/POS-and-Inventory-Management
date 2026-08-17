const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { AppError } = require('../middleware/errorHandler');

/**
 * Generate JWT token for a user
 */
const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
  );
};

/**
 * POST /api/auth/register
 * Register a new user (Admin-only for creating inventory_manager/admin accounts)
 */
const register = async (req, res, next) => {
  try {
    const { username, email, password, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({
      where: { email },
    });
    if (existingUser) {
      throw new AppError('An account with this email already exists', 409);
    }

    const existingUsername = await User.findOne({
      where: { username },
    });
    if (existingUsername) {
      throw new AppError('This username is already taken', 409);
    }

    const user = await User.create({
      username,
      email,
      password,
      role: role || 'cashier',
    });

    const token = generateToken(user);

    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      data: {
        user: user.toSafeJSON(),
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/auth/login
 * Authenticate user and return JWT
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw new AppError('No account found with this email', 401);
    }

    if (!user.is_active) {
      throw new AppError('Your account has been deactivated — contact an administrator', 403);
    }

    const isValid = await user.validatePassword(password);
    if (!isValid) {
      throw new AppError('Incorrect password', 401);
    }

    const token = generateToken(user);

    res.json({
      success: true,
      message: 'Logged in successfully',
      data: {
        user: user.toSafeJSON(),
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/auth/me
 * Return current authenticated user profile
 */
const getProfile = async (req, res, next) => {
  try {
    res.json({
      success: true,
      data: { user: req.user.toSafeJSON() },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login, getProfile };
