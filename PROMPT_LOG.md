# Teerop POS & Inventory Management System — Prompt Log (Deliverable #4)

This document tracks all phase-by-phase prompts used to build the complete Teerop POS system, including issues identified during development and the explicit corrections applied.

---

## Step 0 — Project Brief & Initial Context

**Prompt Sent:**
> "I'm building a Multi-Category POS & Inventory Management System. Stack: React + CSS (Mossy Hollow design), Node.js + Express, Sequelize ORM (SQLite for dev, PostgreSQL for deploy), JWT + bcrypt, Multer uploads. Three roles: Admin, Inventory Manager, Cashier. Product base fields + category fields for Fragile, Cold, Tech, Cleaning, General."

**Observed & Corrected:**
- *Initial Issue:* Windows PowerShell environment choked on `&&` command chaining syntax.
- *Correction:* Converted scripts to PowerShell compatible separators (`;`) and validated local execution.

---

## Phase 1 — Planning & Database Schema

**Prompt Sent:**
> "Propose a Sequelize schema for User, Product, Transaction, TransactionItem using a single flat Product table with nullable category-specific columns. Define model relationships."

**Checks & Corrections:**
- Verified foreign keys (`User` hasMany `Transaction`, `Transaction` hasMany `TransactionItem`, `TransactionItem` belongsTo `Product`).
- Added non-negative check constraints on `quantity_in_stock` and `reorder_threshold`.
- Ensured category is an ENUM (`Fragile`, `Cold`, `Tech`, `Cleaning`, `General`).

---

## Phase 2 — Backend Core & Error Handling

**Prompt Sent:**
> "Set up Express server structure, database config, and centralized error handler middleware. Add Product CRUD routes with express-validator validation."

**Checks & Corrections:**
- Added custom `AppError` class catching Sequelize validation errors, unique constraint clashes, and JWT expiration.
- Ensured all responses follow a standard JSON envelope `{ success, message, data, errors }`.

---

## Phase 3 — Authentication & Role Middleware

**Prompt Sent:**
> "Add authentication: User model with bcrypt-hashed passwords, POST /register, POST /login issuing JWTs, and requireAuth & requireRole middleware. Attach to routes."

**Checks & Corrections:**
- *Check:* Attempted accessing admin-only `/users` endpoint with a Cashier JWT token. Received expected `403 Forbidden` response.
- Passwords verified to be bcrypt hashed with 12 salt rounds in SQLite/PostgreSQL storage.

---

## Phase 4 — Inventory Module & Category Fields

**Prompt Sent:**
> "Build full CRUD for products with category-specific conditional fields. Add Multer image upload, search/filter endpoint, and low-stock endpoint."

**Checks & Corrections:**
- Implemented `sanitizeCategoryFields()`: submitting a Fragile product with Cold fields automatically strips or rejects invalid fields rather than corrupting database records.
- Added virtual helpers `isExpiringSoon()` (triggers when within 3 days) and `isLowStock()` (`quantity <= threshold`).
- Fixed route precedence so `/search` and `/low-stock` are matched before `/:id`.

---

## Phase 5 — Billing & POS Module

**Prompt Sent:**
> "Build billing module: POST /pos/lookup?sku=X, atomic POST /pos/checkout using a single Sequelize transaction, 5% flat tax calculation, and GET /pos/my-transactions scoped to cashier."

**Checks & Corrections:**
- *Stock verification:* Tested checking out 10 units when only 3 were in stock. Checkout cleanly aborted with descriptive error: `"Only 3 units of Organic Oat Milk left — reduce quantity to continue"`.
- Transaction verified to be wrapped inside `sequelize.transaction()` with atomic stock decrement.

---

## Phase 6 — React Frontend & Mossy Hollow Design

**Prompt Sent:**
> "Build React frontend with Mossy Hollow palette (#636B2F, #BAC095, #D4DE95, #3D4127). Implement the scan-to-cart settle animation (~200ms with slight overshoot) using Framer Motion, 60/40 layout, and auto-refocusing scanner input."

**Checks & Corrections:**
- Generated custom 3D organic store scene, checkout success, and empty shelf illustrations using Gemini image generation.
- Scanner input automatically refocuses after every scan for rapid retail workflow.
- Responsive styles verified down to 768px tablet widths.

---

## Phase 7 — Stats, Polish & Documentation

**Prompt Sent:**
> "Add analytics page with total revenue, top-selling products, and threshold logs. Generate StarUML .mdj file and full Obsidian vault."

**Checks & Corrections:**
- Verified StarUML native JSON format in `docs/uml/teerop-pos-architecture.mdj`.
- Created structured Obsidian Vault with Markdown Mermaid diagrams and technical notes.
