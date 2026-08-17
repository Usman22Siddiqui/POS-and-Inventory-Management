const express = require('express');
const router = express.Router();
const { getAllUsers, getUser, updateUser, deleteUser } = require('../controllers/userController');
const { requireAuth, requireRole } = require('../middleware/auth');

// All user management routes: Admin only
router.use(requireAuth);
router.use(requireRole(['admin']));

router.get('/', getAllUsers);
router.get('/:id', getUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

module.exports = router;
