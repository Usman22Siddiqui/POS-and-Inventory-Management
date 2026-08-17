require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { sequelize } = require('./models');
const { errorHandler } = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ──
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded images as static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ── API Routes ──
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/pos', require('./routes/pos'));
app.use('/api/users', require('./routes/users'));
app.use('/api/stats', require('./routes/stats'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', database: 'connected', timestamp: new Date().toISOString() });
});

// ── Error handling (must be last) ──
app.use(errorHandler);

// ── Start server ──
const start = async () => {
  try {
    // Authenticate database connection (Schema managed via Sequelize migrations)
    await sequelize.authenticate();
    console.log('Database connected successfully (PostgreSQL via Sequelize)');

    app.listen(PORT, () => {
      console.log(`\n  Teerop POS API running on http://localhost:${PORT}`);
      console.log(`  Environment: ${process.env.NODE_ENV || 'development'}\n`);
    });
  } catch (error) {
    console.error('Failed to connect to database or start server:', error);
    process.exit(1);
  }
};

start();

module.exports = app;
