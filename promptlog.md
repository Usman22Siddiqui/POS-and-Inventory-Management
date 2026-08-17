# Antigravity Prompt Log

This document provides a chronological record of the AI-agent development workflow, reviews, problem detections, and corrections across all project phases.

---

## Phase 1 — Planning & Database Schema Design
- **Date**: 2026-08-17
- **Prompt**: "Design a unified flat Product table and Sequelize schema for User, Product, Transaction, and TransactionItem supporting category-specific fields (Fragile, Cold, Tech, Cleaning, General)."
- **What Antigravity changed**: Created Sequelize model definitions for User, Product, Transaction, and TransactionItem with model associations.
- **What I reviewed**: Checked if foreign keys, non-negative guards, and category ENUM definitions were correct.
- **Problems found**: Subtype child tables were initially considered which would complicate queries; need a single flat Product table with nullable category columns.
- **Correction/re-prompt**: Enforced a single flat Product table with nullable columns for category-specific fields per `teerop-pos-antigravity-guide.md`.
- **Final result**: Clean schema with single flat Product table and full relational associations.

---

## Phase 2 — Backend Core & PostgreSQL Migrations
- **Date**: 2026-08-17
- **Prompt**: "Set up Express server structure, PostgreSQL database configuration via Sequelize, and Sequelize migrations for all models. Add Product CRUD routes and centralized error handler."
- **What Antigravity changed**: Implemented `config/database.js` for PostgreSQL, created migrations in `migrations/`, set up `errorHandler.js` with custom `AppError`, and built validation middleware using `express-validator`.
- **What I reviewed**: Checked migration definitions (`20260817000001` through `20260817000004`) and error handler JSON format.
- **Problems found**: Local development initially defaulted to SQLite and automatic schema alter sync rather than explicit migrations.
- **Correction/re-prompt**: Configured PostgreSQL with `pg`/`pg-hstore`, replaced `alter: true` with `npx sequelize-cli db:migrate`, and added `.sequelizerc`.
- **Final result**: Production-ready PostgreSQL migration workflow and centralized error handling.

---

## Phase 3 — Authentication & Role-Based Middleware
- **Date**: 2026-08-17
- **Prompt**: "Add JWT authentication with bcrypt password hashing and create requireAuth & requireRole middleware enforcing permissions on API routes."
- **What Antigravity changed**: Created `authController.js`, `models/User.js` bcrypt hooks, and `middleware/auth.js` (`requireAuth` and `requireRole`).
- **What I reviewed**: Tested endpoint permissions by sending requests with tokens from each of the three roles (Admin, Inventory Manager, Cashier).
- **Problems found**: Cashier role was able to see all store transactions on `/pos/my-transactions`.
- **Correction/re-prompt**: Scoped `getMyTransactions` so cashiers only query their own `cashier_id`, whereas Admin has store-wide visibility.
- **Final result**: True backend-enforced RBAC where unauthorized requests immediately return HTTP 403 Forbidden.

---

## Phase 4 — Inventory Module & Dynamic Category Fields
- **Date**: 2026-08-17
- **Prompt**: "Build product CRUD with Multer image upload, category field validation, search/filter endpoint, and low-stock endpoint."
- **What Antigravity changed**: Implemented `productController.js`, Multer disk storage in `backend/uploads/`, and category sanitizer function.
- **What I reviewed**: Verified that submitting invalid category fields (e.g. sending Cold expiry date on Fragile item) is sanitized.
- **Problems found**: Route order in `routes/products.js` had `/:id` before `/search` and `/low-stock`, causing `search` to be evaluated as an ID parameter.
- **Correction/re-prompt**: Reordered routes so `/search` and `/low-stock` are declared before parameterized `/:id` routes.
- **Final result**: Robust inventory API with image uploads, filtered search, and low-stock monitoring (`quantity <= threshold`).

---

## Phase 5 — POS Billing & Atomic Transactions
- **Date**: 2026-08-17
- **Prompt**: "Build POS module with SKU barcode lookup, atomic checkout transaction with 5% flat tax, and automatic stock decrement."
- **What Antigravity changed**: Created `posController.js` wrapping the checkout flow in `sequelize.transaction()`.
- **What I reviewed**: Tested checkout when cart requested more units than were in stock.
- **Problems found**: Partial stock decrement risk if transaction was not rolled back on item failure.
- **Correction/re-prompt**: Wrapped entire checkout (stock verification, Transaction row creation, TransactionItem row creation, stock decrement) in a single managed transaction with explicit rollback.
- **Final result**: Atomic checkout ensuring stock never goes negative and invalid orders abort cleanly.

---

## Phase 6 — React Frontend & Mossy Hollow Design System
- **Date**: 2026-08-17
- **Prompt**: "Build React frontend with Tailwind CSS and the Mossy Hollow palette (#636B2F, #BAC095, #D4DE95, #3D4127). Build POS register, Inventory catalog, and Admin dashboard."
- **What Antigravity changed**: Created Vite React application, configured `tailwind.config.js`, created `Layout.jsx`, `CashierPOS.jsx`, `InventoryDashboard.jsx`, `AdminDashboard.jsx`, and `ReceiptModal.jsx`.
- **What I reviewed**: Checked responsiveness at tablet (~768px) and desktop widths, scanner autofocus, and cart animations.
- **Problems found**: Missing dedicated images for all products in catalog; scanner input required clicking again after scanning.
- **Correction/re-prompt**: Added auto-refocus ref to scanner input on Enter, and populated all 17 multi-category catalog items with custom 3D imagery.
- **Final result**: Polished retail UI with tactile scan-to-cart settle animation and responsive layouts.

---

## Phase 7 — Premium 3D Physical Motion & Polish
- **Date**: 2026-08-17
- **Prompt**: "Add premium physical 3D image motion (mouse-following tilt, frame perspective depth, cursor specular glare, subtle floating loops) without distractive animations on POS checkout."
- **What Antigravity changed**: Created reusable `Tilt3D.jsx` and `FloatingFrame.jsx` components using Framer Motion; integrated them on Login hero, product cards, KPI metrics, and success receipts.
- **What I reviewed**: Verified accessibility with `prefers-reduced-motion: reduce`, touch device detection, and visual restraint on POS register.
- **Problems found**: Unnecessary emojis across titles and badges; excessive tilt on smaller cards.
- **Correction/re-prompt**: Removed all emojis in favor of Feather icons, capped 3D tilt at 5-6 degrees max, and enabled smooth spring recovery.
- **Final result**: Elegant, tactile 3D visual polish adhering to the Mossy Hollow aesthetic.
