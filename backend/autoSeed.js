const { User, Product } = require('./models');

let isInitialized = false;
let initPromise = null;

const autoInitDatabase = async (sequelize) => {
  if (isInitialized) return;
  if (initPromise) return initPromise;

  initPromise = (async () => {
    try {
      await sequelize.authenticate();
      await sequelize.sync(); // Ensures all tables exist

      // Check if users exist
      const userCount = await User.count();
      if (userCount === 0) {
        console.log('⚡ Empty database detected — running auto-seed...');
        const seedFn = require('./seed');
        if (typeof seedFn === 'function') {
          await seedFn();
        } else {
          // Direct seed fallback
          await User.bulkCreate([
            { username: 'admin', email: 'admin@teerop.com', password: 'admin123', role: 'admin' },
            { username: 'manager', email: 'manager@teerop.com', password: 'manager123', role: 'inventory_manager' },
            { username: 'cashier', email: 'cashier@teerop.com', password: 'cashier123', role: 'cashier' },
          ], { individualHooks: true });
        }
        console.log('✓ Auto-seed complete!');
      }
      isInitialized = true;
    } catch (err) {
      console.error('Auto-init database error:', err);
    }
  })();

  return initPromise;
};

module.exports = { autoInitDatabase };
