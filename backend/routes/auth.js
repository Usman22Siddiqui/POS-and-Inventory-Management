const express = require('express');
const router = express.Router();
const { register, login, getProfile } = require('../controllers/authController');
const { registerRules, loginRules, handleValidation } = require('../middleware/validate');
const { requireAuth } = require('../middleware/auth');

// POST /api/auth/register — create a new account
router.post('/register', registerRules, handleValidation, register);

// POST /api/auth/login — authenticate and get JWT
router.post('/login', loginRules, handleValidation, login);

// GET /api/auth/me — current user profile (authenticated)
router.get('/me', requireAuth, getProfile);

module.exports = router;
