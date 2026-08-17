const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const {
  getAllProducts, getProduct, createProduct, updateProduct,
  deleteProduct, searchProducts, getLowStock,
} = require('../controllers/productController');
const { productCreateRules, productUpdateRules, handleValidation } = require('../middleware/validate');
const { requireAuth, requireRole } = require('../middleware/auth');

// ── Multer config for product image uploads ──
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '..', 'uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `product-${uniqueSuffix}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif|webp/;
    const extOk = allowed.test(path.extname(file.originalname).toLowerCase());
    const mimeOk = allowed.test(file.mimetype);
    if (extOk && mimeOk) {
      cb(null, true);
    } else {
      cb(new Error('Only image files (JPEG, PNG, GIF, WebP) are allowed'));
    }
  },
});

// All routes require authentication
router.use(requireAuth);

// Search and low-stock (read access — all authenticated roles)
// These MUST come before /:id to avoid "search" being parsed as an id
router.get('/search', searchProducts);
router.get('/low-stock', getLowStock);

// CRUD routes
router.get('/', getAllProducts);
router.get('/:id', getProduct);

// Write operations — Admin and Inventory Manager only
router.post('/',
  requireRole(['admin', 'inventory_manager']),
  upload.single('image'),
  productCreateRules,
  handleValidation,
  createProduct
);

router.put('/:id',
  requireRole(['admin', 'inventory_manager']),
  upload.single('image'),
  productUpdateRules,
  handleValidation,
  updateProduct
);

// Delete — Admin only
router.delete('/:id',
  requireRole(['admin']),
  deleteProduct
);

module.exports = router;
