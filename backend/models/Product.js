const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Product = sequelize.define('Product', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    sku: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true,
      },
    },
    name: {
      type: DataTypes.STRING(200),
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [2, 200],
      },
    },
    category: {
      type: DataTypes.ENUM('Fragile', 'Cold', 'Tech', 'Cleaning', 'General'),
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0.01,
      },
    },
    quantity_in_stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0,
      },
    },
    reorder_threshold: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 10,
      validate: {
        min: 0,
      },
    },
    image_url: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    // ── Fragile-specific fields ──
    handling_note: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Fragile category only — handling instructions',
    },
    is_fragile: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
      comment: 'Fragile category only — displays warning badge',
    },

    // ── Cold-specific fields ──
    expiry_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      comment: 'Cold category only — required expiry date',
    },
    storage_temp: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: 'Cold category only — e.g. "2-8°C"',
    },

    // ── Tech-specific fields ──
    warranty_period: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'Tech category only — warranty in months',
    },
    serial_number: {
      type: DataTypes.STRING(100),
      allowNull: true,
      unique: true,
      comment: 'Tech category only — unique serial number',
    },

    // ── Cleaning-specific fields ──
    is_hazardous: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
      comment: 'Cleaning category only — hazardous material badge',
    },
    safety_note: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Cleaning category only — safety instructions',
    },
  }, {
    tableName: 'products',
  });

  // Virtual field: check if Cold item is expiring within 3 days
  Product.prototype.isExpiringSoon = function () {
    if (this.category !== 'Cold' || !this.expiry_date) return false;
    const today = new Date();
    const expiry = new Date(this.expiry_date);
    const diffDays = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
    return diffDays <= 3;
  };

  // Virtual field: check if low stock
  Product.prototype.isLowStock = function () {
    return this.quantity_in_stock <= this.reorder_threshold;
  };

  return Product;
};
