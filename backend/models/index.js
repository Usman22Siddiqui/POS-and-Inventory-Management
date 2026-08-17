const { Sequelize } = require('sequelize');
const config = require('../config/database');

const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env] || config.development;

const isCloudDb = !!process.env.DATABASE_URL || process.env.DB_SSL === 'true' || process.env.NODE_ENV === 'production';
const defaultDialectOptions = isCloudDb ? {
  ssl: {
    require: true,
    rejectUnauthorized: false,
  },
} : {};

let sequelize;

if (process.env.DATABASE_URL) {
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    logging: dbConfig?.logging || false,
    define: dbConfig?.define || { timestamps: true, underscored: true },
    dialectOptions: dbConfig?.dialectOptions?.ssl ? dbConfig.dialectOptions : defaultDialectOptions,
  });
} else if (dbConfig.dialect === 'sqlite') {
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: dbConfig.storage || './database.sqlite',
    logging: dbConfig.logging,
    define: dbConfig.define,
  });
} else {
  sequelize = new Sequelize(
    dbConfig.database,
    dbConfig.username,
    dbConfig.password,
    {
      host: dbConfig.host,
      port: dbConfig.port,
      dialect: dbConfig.dialect || 'postgres',
      logging: dbConfig.logging,
      define: dbConfig.define,
      dialectOptions: dbConfig.dialectOptions || {},
    }
  );
}

const db = {};

// Import models
db.User = require('./User')(sequelize);
db.Product = require('./Product')(sequelize);
db.Transaction = require('./Transaction')(sequelize);
db.TransactionItem = require('./TransactionItem')(sequelize);

// Define associations
// User has many Transactions (as cashier)
db.User.hasMany(db.Transaction, { foreignKey: 'cashier_id', as: 'transactions' });
db.Transaction.belongsTo(db.User, { foreignKey: 'cashier_id', as: 'cashier' });

// Transaction has many TransactionItems
db.Transaction.hasMany(db.TransactionItem, { foreignKey: 'transaction_id', as: 'items' });
db.TransactionItem.belongsTo(db.Transaction, { foreignKey: 'transaction_id' });

// TransactionItem belongs to Product
db.TransactionItem.belongsTo(db.Product, { foreignKey: 'product_id', as: 'product' });
db.Product.hasMany(db.TransactionItem, { foreignKey: 'product_id' });

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
