const { Product, Transaction, TransactionItem, sequelize } = require('../models');
const { AppError } = require('../middleware/errorHandler');

// Tax rate: 5% flat (documented as per spec)
const TAX_RATE = parseFloat(process.env.TAX_RATE) || 0.05;

/**
 * POST /api/pos/lookup?sku=X
 * Look up a product by SKU for the scanner input
 */
const lookupBySku = async (req, res, next) => {
  try {
    const { sku } = req.query;

    if (!sku) {
      throw new AppError('SKU is required — scan or type a product code', 400);
    }

    const product = await Product.findOne({ where: { sku } });
    if (!product) {
      throw new AppError(`No product found with SKU "${sku}"`, 404);
    }

    res.json({
      success: true,
      data: {
        product: {
          id: product.id,
          sku: product.sku,
          name: product.name,
          category: product.category,
          price: parseFloat(product.price),
          currentStock: product.quantity_in_stock,
          image_url: product.image_url,
          is_fragile: product.is_fragile,
          is_hazardous: product.is_hazardous,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/pos/checkout
 * Process a sale — atomic: verify stock, create transaction, decrement stock
 * 
 * Body: { items: [{ productId, quantity }] }
 * Tax rate: 5% flat
 */
const checkout = async (req, res, next) => {
  // Use a Sequelize managed transaction so everything rolls back on failure
  const t = await sequelize.transaction();

  try {
    const { items } = req.body;
    const cashierId = req.user.id;

    let subtotal = 0;
    const lineItems = [];

    // Step 1: Verify stock and calculate totals for every line item
    for (const item of items) {
      const product = await Product.findByPk(item.productId, { transaction: t, lock: true });

      if (!product) {
        throw new AppError(`Product with ID ${item.productId} not found`, 404);
      }

      if (product.quantity_in_stock < item.quantity) {
        throw new AppError(
          `Only ${product.quantity_in_stock} units of "${product.name}" left — reduce quantity to continue`,
          400
        );
      }

      const unitPrice = parseFloat(product.price);
      const lineSubtotal = unitPrice * item.quantity;
      subtotal += lineSubtotal;

      lineItems.push({
        product,
        quantity: item.quantity,
        unitPrice,
        lineSubtotal,
      });
    }

    // Step 2: Calculate tax and total
    const taxAmount = parseFloat((subtotal * TAX_RATE).toFixed(2));
    const totalAmount = parseFloat((subtotal + taxAmount).toFixed(2));

    // Step 3: Create the transaction record
    const transaction = await Transaction.create({
      cashier_id: cashierId,
      total_amount: totalAmount,
      tax: taxAmount,
      timestamp: new Date(),
    }, { transaction: t });

    // Step 4: Create line items and decrement stock
    const transactionItems = [];
    for (const line of lineItems) {
      const txItem = await TransactionItem.create({
        transaction_id: transaction.id,
        product_id: line.product.id,
        quantity: line.quantity,
        unit_price: line.unitPrice,
        subtotal: line.lineSubtotal,
      }, { transaction: t });

      // Decrement stock
      await line.product.update({
        quantity_in_stock: line.product.quantity_in_stock - line.quantity,
      }, { transaction: t });

      transactionItems.push({
        id: txItem.id,
        productId: line.product.id,
        productName: line.product.name,
        sku: line.product.sku,
        quantity: line.quantity,
        unitPrice: line.unitPrice,
        subtotal: line.lineSubtotal,
      });
    }

    // Step 5: Commit — all or nothing
    await t.commit();

    res.status(201).json({
      success: true,
      message: 'Checkout completed successfully',
      data: {
        transaction: {
          id: transaction.id,
          timestamp: transaction.timestamp,
          subtotal: parseFloat(subtotal.toFixed(2)),
          tax: taxAmount,
          taxRate: `${TAX_RATE * 100}%`,
          totalAmount,
          cashier: req.user.username,
          items: transactionItems,
        },
      },
    });
  } catch (error) {
    // Roll back on any failure — stock stays untouched
    await t.rollback();
    next(error);
  }
};

/**
 * GET /api/pos/my-transactions
 * Cashier sees own transactions; Admin sees all
 */
const getMyTransactions = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    const where = {};

    // Cashiers can only see their own transactions
    if (req.user.role === 'cashier') {
      where.cashier_id = req.user.id;
    }

    const { count, rows } = await Transaction.findAndCountAll({
      where,
      include: [
        {
          model: TransactionItem,
          as: 'items',
          include: [{ model: Product, as: 'product', attributes: ['id', 'name', 'sku', 'category'] }],
        },
        {
          model: require('../models').User,
          as: 'cashier',
          attributes: ['id', 'username', 'email'],
        },
      ],
      order: [['timestamp', 'DESC']],
      limit,
      offset,
    });

    res.json({
      success: true,
      data: {
        transactions: rows,
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

module.exports = { lookupBySku, checkout, getMyTransactions };
