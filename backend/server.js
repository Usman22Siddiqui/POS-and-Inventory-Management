require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { sequelize } = require('./models');
const { autoInitDatabase } = require('./autoSeed');
const { errorHandler } = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ──
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:3000',
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (
      allowedOrigins.includes(origin) ||
      origin.endsWith('.vercel.app') ||
      process.env.NODE_ENV !== 'production'
    ) {
      return callback(null, true);
    }
    return callback(null, true);
  },
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded images as static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ── Auto-Initialize Database on Serverless/Cloud ──
app.use(async (req, res, next) => {
  try {
    await autoInitDatabase(sequelize);
    next();
  } catch (err) {
    console.error('Database connection error:', err);
    res.status(500).json({
      success: false,
      message: `Database error: ${err.message}. Please check your DATABASE_URL in Vercel.`,
    });
  }
});

const { metricsMiddleware, getPrometheusMetrics } = require('./middleware/metrics');

// ── Metrics Middleware ──
app.use(metricsMiddleware);

// ── Prometheus Metrics Endpoint ──
app.get('/api/metrics', (req, res) => {
  res.setHeader('Content-Type', 'text/plain; version=0.0.4; charset=utf-8');
  res.send(getPrometheusMetrics());
});

// ── API Routes ──
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/pos', require('./routes/pos'));
app.use('/api/users', require('./routes/users'));
app.use('/api/stats', require('./routes/stats'));

// Manual trigger seed endpoint
app.get('/api/seed', async (req, res) => {
  try {
    const seed = require('./seed');
    await seed();
    res.json({ success: true, message: 'Database successfully seeded with 17 products & demo users!' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    database: sequelize.getDialect(),
    timestamp: new Date().toISOString(),
  });
});

// ── Error handling (must be last) ──
app.use(errorHandler);

// ── Start server for local dev ──
const start = async () => {
  try {
    await autoInitDatabase(sequelize);
    console.log(`Database connected successfully (${sequelize.getDialect()} via Sequelize)`);

    app.listen(PORT, () => {
      console.log(`\n  Teerop POS API running on http://localhost:${PORT}`);
      console.log(`  Environment: ${process.env.NODE_ENV || 'development'}\n`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

if (process.env.NODE_ENV !== 'production' && require.main === module) {
  start();
}

module.exports = app;
