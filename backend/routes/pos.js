const express = require('express');
const router = express.Router();
const { lookupBySku, checkout, getMyTransactions } = require('../controllers/posController');
const { checkoutRules, handleValidation } = require('../middleware/validate');
const { requireAuth, requireRole } = require('../middleware/auth');

// All POS routes require authentication
router.use(requireAuth);

// SKU lookup — any authenticated user (primarily Cashier)
router.get('/lookup', lookupBySku);

// Checkout — Cashier and Admin can process sales
router.post('/checkout',
  requireRole(['cashier', 'admin']),
  checkoutRules,
  handleValidation,
  checkout
);

// Transaction history — Cashier sees own, Admin sees all
router.get('/my-transactions', getMyTransactions);

module.exports = router;
