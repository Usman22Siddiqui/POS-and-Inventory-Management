const { body, query, validationResult } = require('express-validator');
const { AppError } = require('./errorHandler');

/**
 * Processes express-validator results and throws AppError if validation failed
 */
const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map(err => ({
      field: err.path,
      message: err.msg,
    }));
    throw new AppError('Validation failed', 400, formattedErrors);
  }
  next();
};

// ── Product validation rules ──

const VALID_CATEGORIES = ['Fragile', 'Cold', 'Tech', 'Cleaning', 'General'];

const productCreateRules = [
  body('sku')
    .trim().notEmpty().withMessage('SKU is required')
    .isLength({ max: 50 }).withMessage('SKU must be 50 characters or fewer'),
  body('name')
    .trim().notEmpty().withMessage('Product name is required')
    .isLength({ min: 2, max: 200 }).withMessage('Product name must be 2–200 characters'),
  body('category')
    .notEmpty().withMessage('Category is required')
    .isIn(VALID_CATEGORIES).withMessage(`Category must be one of: ${VALID_CATEGORIES.join(', ')}`),
  body('price')
    .notEmpty().withMessage('Price is required')
    .isFloat({ min: 0.01 }).withMessage('Price must be at least 0.01'),
  body('quantity_in_stock')
    .optional()
    .isInt({ min: 0 }).withMessage('Quantity must be a non-negative integer'),
  body('reorder_threshold')
    .optional()
    .isInt({ min: 0 }).withMessage('Reorder threshold must be a non-negative integer'),
  body('description')
    .optional().trim(),

  // Category-specific validation
  body('handling_note')
    .optional().trim(),
  body('is_fragile')
    .optional().isBoolean().withMessage('is_fragile must be true or false'),
  body('expiry_date')
    .optional().isISO8601().withMessage('Expiry date must be a valid date (YYYY-MM-DD)'),
  body('storage_temp')
    .optional().trim(),
  body('warranty_period')
    .optional().isInt({ min: 1 }).withMessage('Warranty period must be at least 1 month'),
  body('serial_number')
    .optional().trim(),
  body('is_hazardous')
    .optional().isBoolean().withMessage('is_hazardous must be true or false'),
  body('safety_note')
    .optional().trim(),
];

const productUpdateRules = [
  body('name')
    .optional().trim()
    .isLength({ min: 2, max: 200 }).withMessage('Product name must be 2–200 characters'),
  body('category')
    .optional()
    .isIn(VALID_CATEGORIES).withMessage(`Category must be one of: ${VALID_CATEGORIES.join(', ')}`),
  body('price')
    .optional()
    .isFloat({ min: 0.01 }).withMessage('Price must be at least 0.01'),
  body('quantity_in_stock')
    .optional()
    .isInt({ min: 0 }).withMessage('Quantity must be a non-negative integer'),
  body('reorder_threshold')
    .optional()
    .isInt({ min: 0 }).withMessage('Reorder threshold must be a non-negative integer'),
  body('description')
    .optional().trim(),
  body('handling_note').optional().trim(),
  body('is_fragile').optional().isBoolean(),
  body('expiry_date').optional().isISO8601(),
  body('storage_temp').optional().trim(),
  body('warranty_period').optional().isInt({ min: 1 }),
  body('serial_number').optional().trim(),
  body('is_hazardous').optional().isBoolean(),
  body('safety_note').optional().trim(),
];

// ── Auth validation rules ──

const registerRules = [
  body('username')
    .trim().notEmpty().withMessage('Username is required')
    .isLength({ min: 3, max: 50 }).withMessage('Username must be 3–50 characters')
    .matches(/^[a-zA-Z0-9_]+$/).withMessage('Username can only contain letters, numbers, and underscores'),
  body('email')
    .trim().notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please enter a valid email address'),
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role')
    .optional()
    .isIn(['admin', 'inventory_manager', 'cashier']).withMessage('Role must be admin, inventory_manager, or cashier'),
];

const loginRules = [
  body('email')
    .trim().notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please enter a valid email address'),
  body('password')
    .notEmpty().withMessage('Password is required'),
];

// ── Checkout validation rules ──

const checkoutRules = [
  body('items')
    .isArray({ min: 1 }).withMessage('Cart must contain at least one item'),
  body('items.*.productId')
    .notEmpty().withMessage('Each item must have a productId')
    .isInt({ min: 1 }).withMessage('productId must be a positive integer'),
  body('items.*.quantity')
    .notEmpty().withMessage('Each item must have a quantity')
    .isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
];

module.exports = {
  handleValidation,
  productCreateRules,
  productUpdateRules,
  registerRules,
  loginRules,
  checkoutRules,
};
