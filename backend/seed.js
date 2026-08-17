/**
 * Seed script — populates the database with demo data for all 3 roles
 * and sample products across all 5 categories with dedicated 3D product images.
 */

require('dotenv').config();
const { sequelize, User, Product, Transaction, TransactionItem } = require('./models');

const seed = async () => {
  try {
    console.log('Seeding database with full 3D product catalog...\n');

    await sequelize.sync({ force: true });

    // Users
    const admin = await User.create({
      username: 'admin',
      email: 'admin@teerop.com',
      password: 'admin123',
      role: 'admin',
    });

    const manager = await User.create({
      username: 'manager',
      email: 'manager@teerop.com',
      password: 'manager123',
      role: 'inventory_manager',
    });

    const cashier = await User.create({
      username: 'cashier',
      email: 'cashier@teerop.com',
      password: 'cashier123',
      role: 'cashier',
    });

    const cashier2 = await User.create({
      username: 'cashier2',
      email: 'cashier2@teerop.com',
      password: 'cashier123',
      role: 'cashier',
    });

    // Fragile items
    const fragileProducts = await Product.bulkCreate([
      {
        sku: 'FRG-001',
        name: 'Crystal Wine Glass Set',
        category: 'Fragile',
        price: 45.99,
        quantity_in_stock: 25,
        reorder_threshold: 10,
        image_url: '/uploads/frg-001.jpg',
        description: 'Set of 6 premium crystal wine glasses',
        handling_note: 'Handle with extreme care — wrap individually in bubble wrap',
        is_fragile: true,
      },
      {
        sku: 'FRG-002',
        name: 'Ceramic Dinner Plates',
        category: 'Fragile',
        price: 32.50,
        quantity_in_stock: 40,
        reorder_threshold: 15,
        image_url: '/uploads/frg-002.svg',
        description: 'Hand-painted ceramic dinner plates, set of 4',
        handling_note: 'Stack with padding between plates',
        is_fragile: true,
      },
      {
        sku: 'FRG-003',
        name: 'Glass Vase — Artisan',
        category: 'Fragile',
        price: 68.00,
        quantity_in_stock: 8,
        reorder_threshold: 5,
        image_url: '/uploads/frg-003.svg',
        description: 'Handblown glass vase, 12 inches tall',
        handling_note: 'Do not stack — store upright only',
        is_fragile: true,
      },
    ]);

    // Cold items
    const coldProducts = await Product.bulkCreate([
      {
        sku: 'CLD-001',
        name: 'Organic Oat Milk',
        category: 'Cold',
        price: 4.99,
        quantity_in_stock: 3,
        reorder_threshold: 20,
        image_url: '/uploads/cld-001.jpg',
        description: 'Fresh organic oat milk, 1 liter',
        expiry_date: getDateFromNow(2),
        storage_temp: '2-6°C',
      },
      {
        sku: 'CLD-002',
        name: 'Greek Yogurt — Honey',
        category: 'Cold',
        price: 3.49,
        quantity_in_stock: 50,
        reorder_threshold: 15,
        image_url: '/uploads/cld-002.svg',
        description: 'Thick Greek yogurt with raw honey, 500g',
        expiry_date: getDateFromNow(14),
        storage_temp: '2-8°C',
      },
      {
        sku: 'CLD-003',
        name: 'Smoked Salmon Fillet',
        category: 'Cold',
        price: 12.99,
        quantity_in_stock: 15,
        reorder_threshold: 8,
        image_url: '/uploads/cld-003.svg',
        description: 'Wild-caught smoked salmon, 200g pack',
        expiry_date: getDateFromNow(5),
        storage_temp: '0-4°C',
      },
      {
        sku: 'CLD-004',
        name: 'Fresh Mozzarella Ball',
        category: 'Cold',
        price: 6.50,
        quantity_in_stock: 30,
        reorder_threshold: 10,
        image_url: '/uploads/cld-004.svg',
        description: 'Italian buffalo mozzarella, 250g',
        expiry_date: getDateFromNow(1),
        storage_temp: '2-6°C',
      },
    ]);

    // Tech items
    const techProducts = await Product.bulkCreate([
      {
        sku: 'TCH-001',
        name: 'Wireless Bluetooth Earbuds',
        category: 'Tech',
        price: 79.99,
        quantity_in_stock: 45,
        reorder_threshold: 10,
        image_url: '/uploads/tch-001.jpg',
        description: 'Noise-cancelling earbuds with 24h battery life',
        warranty_period: 12,
        serial_number: 'WBE-2024-00001',
      },
      {
        sku: 'TCH-002',
        name: 'USB-C Charging Hub',
        category: 'Tech',
        price: 34.99,
        quantity_in_stock: 60,
        reorder_threshold: 20,
        image_url: '/uploads/tch-002.svg',
        description: '7-port USB-C hub with HDMI and ethernet',
        warranty_period: 24,
        serial_number: 'UCH-2024-00001',
      },
      {
        sku: 'TCH-003',
        name: 'Mechanical Keyboard — Compact',
        category: 'Tech',
        price: 129.99,
        quantity_in_stock: 5,
        reorder_threshold: 8,
        image_url: '/uploads/tch-003.svg',
        description: '75% mechanical keyboard with hot-swappable switches',
        warranty_period: 18,
        serial_number: 'MKC-2024-00001',
      },
    ]);

    // Cleaning items
    const cleaningProducts = await Product.bulkCreate([
      {
        sku: 'CLN-001',
        name: 'Industrial Degreaser',
        category: 'Cleaning',
        price: 18.99,
        quantity_in_stock: 35,
        reorder_threshold: 12,
        image_url: '/uploads/cln-001.svg',
        description: 'Heavy-duty industrial degreaser, 2L concentrate',
        is_hazardous: true,
        safety_note: 'Use in well-ventilated areas. Wear gloves and eye protection.',
      },
      {
        sku: 'CLN-002',
        name: 'Eco Floor Cleaner',
        category: 'Cleaning',
        price: 8.99,
        quantity_in_stock: 80,
        reorder_threshold: 25,
        image_url: '/uploads/cln-002.svg',
        description: 'Plant-based floor cleaner, lavender scent, 1L',
        is_hazardous: false,
        safety_note: 'Keep out of reach of children.',
      },
      {
        sku: 'CLN-003',
        name: 'Bleach Concentrate',
        category: 'Cleaning',
        price: 5.49,
        quantity_in_stock: 7,
        reorder_threshold: 15,
        image_url: '/uploads/cln-003.svg',
        description: 'Concentrated bleach solution, 1L',
        is_hazardous: true,
        safety_note: 'DANGER: Do not mix with ammonia or other chemicals.',
      },
    ]);

    // General items
    const generalProducts = await Product.bulkCreate([
      {
        sku: 'GEN-001',
        name: 'Cotton Tote Bag',
        category: 'General',
        price: 12.99,
        quantity_in_stock: 100,
        reorder_threshold: 30,
        image_url: '/uploads/gen-001.svg',
        description: 'Heavy-duty organic cotton tote bag, natural color',
      },
      {
        sku: 'GEN-002',
        name: 'Beeswax Candle Set',
        category: 'General',
        price: 22.50,
        quantity_in_stock: 40,
        reorder_threshold: 10,
        image_url: '/uploads/gen-002.svg',
        description: 'Set of 3 hand-rolled beeswax candles',
      },
      {
        sku: 'GEN-003',
        name: 'Recycled Paper Notebook',
        category: 'General',
        price: 9.99,
        quantity_in_stock: 2,
        reorder_threshold: 20,
        image_url: '/uploads/gen-003.svg',
        description: 'A5 lined notebook, 200 pages, recycled paper',
      },
      {
        sku: 'GEN-004',
        name: 'Bamboo Cutting Board',
        category: 'General',
        price: 28.00,
        quantity_in_stock: 25,
        reorder_threshold: 8,
        image_url: '/uploads/gen-004.svg',
        description: 'Large bamboo cutting board with juice groove',
      },
    ]);

    // Sample transactions
    const tx1 = await Transaction.create({
      cashier_id: cashier.id,
      total_amount: 97.96,
      tax: 4.66,
      timestamp: new Date(Date.now() - 3600000),
    });

    await TransactionItem.bulkCreate([
      { transaction_id: tx1.id, product_id: coldProducts[1].id, quantity: 2, unit_price: 3.49, subtotal: 6.98 },
      { transaction_id: tx1.id, product_id: techProducts[0].id, quantity: 1, unit_price: 79.99, subtotal: 79.99 },
      { transaction_id: tx1.id, product_id: generalProducts[0].id, quantity: 1, unit_price: 12.99, subtotal: 12.99 },
    ]);

    console.log('✓ Seeding complete with 17 product images attached!');
    if (require.main === module) {
      process.exit(0);
    }
    return true;
  } catch (error) {
    console.error('Seed failed:', error);
    if (require.main === module) {
      process.exit(1);
    }
    throw error;
  }
};

function getDateFromNow(days) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
}

if (require.main === module) {
  seed();
}

module.exports = seed;
