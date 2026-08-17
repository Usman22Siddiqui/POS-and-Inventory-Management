const { Sequelize } = require('sequelize');
const config = require('../config/database');

let pg;
try {
  pg = require('pg');
} catch (e) {
  // pg fallback if not loaded
}

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
    dialectModule: pg,
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
      dialectModule: pg,
      logging: dbConfig.logging,
      define: dbConfig.define,
      dialectOptions: dbConfig.dialectOptions || defaultDialectOptions,
    }
  );
}

const db = {};

// Import models
db.User = require('./User')(sequelize);
db.Product = require('./Product')(sequelize);
db.Transaction = require('./Transaction')(sequelize);
db.TransactionItem = require('./TransactionItem')(sequelize);

// Associations
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
