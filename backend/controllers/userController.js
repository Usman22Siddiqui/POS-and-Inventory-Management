const { User } = require('../models');
const { AppError } = require('../middleware/errorHandler');

/**
 * GET /api/users
 * List all users (Admin only)
 */
const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password'] },
      order: [['created_at', 'DESC']],
    });

    res.json({
      success: true,
      data: { users },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/users/:id
 * Get single user (Admin only)
 */
const getUser = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ['password'] },
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    res.json({
      success: true,
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/users/:id
 * Update user role/status (Admin only)
 */
const updateUser = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    const { role, is_active, username, email } = req.body;

    if (role) user.role = role;
    if (typeof is_active === 'boolean') user.is_active = is_active;
    if (username) user.username = username;
    if (email) user.email = email;

    await user.save();

    res.json({
      success: true,
      message: 'User updated successfully',
      data: { user: user.toSafeJSON() },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/users/:id
 * Delete a user (Admin only, cannot delete self)
 */
const deleteUser = async (req, res, next) => {
  try {
    if (parseInt(req.params.id) === req.user.id) {
      throw new AppError('You cannot delete your own account', 400);
    }

    const user = await User.findByPk(req.params.id);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    await user.destroy();

    res.json({
      success: true,
      message: `User "${user.username}" has been deleted`,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAllUsers, getUser, updateUser, deleteUser };
