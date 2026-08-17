const { Op } = require('sequelize');
const { Product } = require('../models');
const { AppError } = require('../middleware/errorHandler');

// Map of which extra fields are allowed per category
const CATEGORY_FIELDS = {
  Fragile: ['handling_note', 'is_fragile'],
  Cold: ['expiry_date', 'storage_temp'],
  Tech: ['warranty_period', 'serial_number'],
  Cleaning: ['is_hazardous', 'safety_note'],
  General: [],
};

// All possible category-specific fields
const ALL_EXTRA_FIELDS = [
  'handling_note', 'is_fragile', 'expiry_date', 'storage_temp',
  'warranty_period', 'serial_number', 'is_hazardous', 'safety_note',
];

/**
 * Strip category-specific fields that don't belong to the given category
 * and null out fields from other categories
 */
const sanitizeCategoryFields = (data) => {
  const category = data.category;
  const allowedFields = CATEGORY_FIELDS[category] || [];
  const sanitized = { ...data };

  // Null out any field that doesn't belong to this category
  ALL_EXTRA_FIELDS.forEach(field => {
    if (!allowedFields.includes(field)) {
      sanitized[field] = null;
    }
  });

  // Cold items require expiry_date
  if (category === 'Cold' && !sanitized.expiry_date) {
    throw new AppError('Cold category items require an expiry date', 400);
  }

  return sanitized;
};

/**
 * GET /api/products
 * List all products (paginated)
 */
const getAllProducts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const offset = (page - 1) * limit;

    const { count, rows } = await Product.findAndCountAll({
      limit,
      offset,
      order: [['name', 'ASC']],
    });

    // Add computed flags
    const products = rows.map(p => {
      const json = p.toJSON();
      json.is_low_stock = p.isLowStock();
      json.is_expiring_soon = p.isExpiringSoon();
      return json;
    });

    res.json({
      success: true,
      data: {
        products,
        pagination: {
          page,
          limit,
          total: count,
          totalPages: Math.ceil(count / limit),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/products/:id
 * Get single product by ID
 */
const getProduct = async (req, res, next) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      throw new AppError('Product not found', 404);
    }

    const json = product.toJSON();
    json.is_low_stock = product.isLowStock();
    json.is_expiring_soon = product.isExpiringSoon();

    res.json({
      success: true,
      data: { product: json },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/products
 * Create a new product (Admin, Inventory Manager)
 */
const createProduct = async (req, res, next) => {
  try {
    let data = { ...req.body };

    // Handle uploaded image
    if (req.file) {
      data.image_url = `/uploads/${req.file.filename}`;
    }

    // Sanitize category-specific fields
    data = sanitizeCategoryFields(data);

    const product = await Product.create(data);

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: { product: product.toJSON() },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/products/:id
 * Update a product (Admin, Inventory Manager)
 */
const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      throw new AppError('Product not found', 404);
    }

    let data = { ...req.body };

    // Handle uploaded image
    if (req.file) {
      data.image_url = `/uploads/${req.file.filename}`;
    }

    // If category is being changed, sanitize fields for the new category
    if (data.category) {
      data = sanitizeCategoryFields(data);
    }

    await product.update(data);

    const json = product.toJSON();
    json.is_low_stock = product.isLowStock();
    json.is_expiring_soon = product.isExpiringSoon();

    res.json({
      success: true,
      message: 'Product updated successfully',
      data: { product: json },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/products/:id
 * Delete a product (Admin only)
 */
const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      throw new AppError('Product not found', 404);
    }

    await product.destroy();

    res.json({
      success: true,
      message: `"${product.name}" has been deleted`,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/products/search?name=&sku=&category=
 * Search/filter products with partial matching
 */
const searchProducts = async (req, res, next) => {
  try {
    const { name, sku, category } = req.query;
    const where = {};

    if (name) {
      where.name = { [Op.like]: `%${name}%` };
    }

    if (sku) {
      where.sku = { [Op.like]: `%${sku}%` };
    }

    if (category) {
      const validCategories = ['Fragile', 'Cold', 'Tech', 'Cleaning', 'General'];
      if (!validCategories.includes(category)) {
        throw new AppError(`Invalid category — must be one of: ${validCategories.join(', ')}`, 400);
      }
      where.category = category;
    }

    const products = await Product.findAll({
      where,
      order: [['name', 'ASC']],
    });

    const result = products.map(p => {
      const json = p.toJSON();
      json.is_low_stock = p.isLowStock();
      json.is_expiring_soon = p.isExpiringSoon();
      return json;
    });

    res.json({
      success: true,
      data: { products: result, count: result.length },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/products/low-stock
 * Products where quantityInStock <= reorderThreshold
 */
const getLowStock = async (req, res, next) => {
  try {
    const products = await Product.findAll({
      where: {
        quantity_in_stock: {
          [Op.lte]: require('sequelize').col('reorder_threshold'),
        },
      },
      order: [['quantity_in_stock', 'ASC']],
    });

    const result = products.map(p => {
      const json = p.toJSON();
      json.is_low_stock = true;
      json.is_expiring_soon = p.isExpiringSoon();
      return json;
    });

    res.json({
      success: true,
      data: { products: result, count: result.length },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  searchProducts,
  getLowStock,
};
