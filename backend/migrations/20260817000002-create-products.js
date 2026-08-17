'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('products', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      sku: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true,
      },
      name: {
        type: Sequelize.STRING(200),
        allowNull: false,
      },
      category: {
        type: Sequelize.ENUM('Fragile', 'Cold', 'Tech', 'Cleaning', 'General'),
        allowNull: false,
      },
      price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      quantity_in_stock: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      reorder_threshold: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 10,
      },
      image_url: {
        type: Sequelize.STRING(500),
        allowNull: true,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },

      // Category specific fields
      handling_note: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      is_fragile: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      },
      expiry_date: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      storage_temp: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      warranty_period: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      serial_number: {
        type: Sequelize.STRING(100),
        allowNull: true,
        unique: true,
      },
      is_hazardous: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      },
      safety_note: {
        type: Sequelize.TEXT,
        allowNull: true,
      },

      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });

    await queryInterface.addIndex('products', ['sku']);
    await queryInterface.addIndex('products', ['category']);
    await queryInterface.addIndex('products', ['name']);
    await queryInterface.addIndex('products', ['quantity_in_stock']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('products');
  },
};
