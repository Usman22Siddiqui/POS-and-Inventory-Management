const { Sequelize } = require('sequelize');
const config = require('../config/database');

const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

let sequelize;

if (dbConfig.dialect === 'sqlite') {
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: dbConfig.storage,
    logging: dbConfig.logging,
    define: dbConfig.define,
  });
} else {
  sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, {
    host: dbConfig.host,
    port: dbConfig.port,
    dialect: dbConfig.dialect,
    logging: dbConfig.logging,
    define: dbConfig.define,
    dialectOptions: dbConfig.dialectOptions,
  });
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
