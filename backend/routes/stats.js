const express = require('express');
const router = express.Router();
const { getOverview } = require('../controllers/statsController');
const { requireAuth, requireRole } = require('../middleware/auth');

// Stats: Admin and Inventory Manager only — Cashier cannot access
router.use(requireAuth);
router.use(requireRole(['admin', 'inventory_manager']));

router.get('/overview', getOverview);

module.exports = router;
