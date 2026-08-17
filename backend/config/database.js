require('dotenv').config();

const dialectOptions = process.env.DB_SSL === 'true' ? {
  ssl: {
    require: true,
    rejectUnauthorized: false,
  },
} : {};

module.exports = {
  development: {
    use_env_variable: process.env.DATABASE_URL ? 'DATABASE_URL' : undefined,
    url: process.env.DATABASE_URL || undefined,
    host: process.env.DB_HOST || '127.0.0.1',
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    database: process.env.DB_NAME || 'teerop_pos',
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    dialect: 'postgres',
    logging: process.env.DB_LOGGING === 'true' ? console.log : false,
    define: {
      timestamps: true,
      underscored: true,
    },
    dialectOptions,
  },
  test: {
    host: process.env.DB_HOST || '127.0.0.1',
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    database: process.env.DB_NAME_TEST || 'teerop_pos_test',
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    dialect: 'postgres',
    logging: false,
    define: {
      timestamps: true,
      underscored: true,
    },
    dialectOptions,
  },
  production: {
    use_env_variable: process.env.DATABASE_URL ? 'DATABASE_URL' : undefined,
    url: process.env.DATABASE_URL || undefined,
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    database: process.env.DB_NAME || 'teerop_pos',
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD,
    dialect: 'postgres',
    logging: false,
    define: {
      timestamps: true,
      underscored: true,
    },
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  },
};
