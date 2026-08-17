const { Op, fn, col, literal } = require('sequelize');
const { Transaction, TransactionItem, Product, User, sequelize } = require('../models');
const { AppError } = require('../middleware/errorHandler');

/**
 * GET /api/stats/overview
 * Dashboard stats: today's sales, all-time sales, transaction count, top products, low-stock
 * Accessible by Admin and Inventory Manager only
 */
const getOverview = async (req, res, next) => {
  try {
    // Today's date range
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    // ── All-time sales ──
    const allTimeSales = await Transaction.findOne({
      attributes: [
        [fn('COALESCE', fn('SUM', col('total_amount')), 0), 'total'],
        [fn('COUNT', col('id')), 'count'],
      ],
      raw: true,
    });

    // ── Today's sales ──
    const todaySales = await Transaction.findOne({
      attributes: [
        [fn('COALESCE', fn('SUM', col('total_amount')), 0), 'total'],
        [fn('COUNT', col('id')), 'count'],
      ],
      where: {
        timestamp: { [Op.between]: [todayStart, todayEnd] },
      },
      raw: true,
    });

    // ── Top-selling products (by quantity sold) ──
    const topProducts = await TransactionItem.findAll({
      attributes: [
        'product_id',
        [fn('SUM', col('quantity')), 'total_sold'],
        [fn('SUM', col('subtotal')), 'total_revenue'],
      ],
      include: [{
        model: Product,
        as: 'product',
        attributes: ['id', 'name', 'sku', 'category', 'price', 'image_url'],
      }],
      group: ['product_id'],
      order: [[fn('SUM', col('quantity')), 'DESC']],
      limit: 10,
      raw: false,
    });

    // ── Low-stock products ──
    const lowStockProducts = await Product.findAll({
      where: {
        quantity_in_stock: {
          [Op.lte]: col('reorder_threshold'),
        },
      },
      order: [['quantity_in_stock', 'ASC']],
      limit: 20,
    });

    // ── Active users count ──
    const activeUsers = await User.count({ where: { is_active: true } });

    // ── Recent transactions ──
    const recentTransactions = await Transaction.findAll({
      include: [{
        model: User,
        as: 'cashier',
        attributes: ['id', 'username'],
      }],
      order: [['timestamp', 'DESC']],
      limit: 10,
    });

    res.json({
      success: true,
      data: {
        allTimeSales: {
          total: parseFloat(allTimeSales.total) || 0,
          count: parseInt(allTimeSales.count) || 0,
        },
        todaySales: {
          total: parseFloat(todaySales.total) || 0,
          count: parseInt(todaySales.count) || 0,
        },
        topProducts,
        lowStockProducts: lowStockProducts.map(p => p.toJSON()),
        lowStockCount: lowStockProducts.length,
        activeUsers,
        recentTransactions,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getOverview };
