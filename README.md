# Teerop POS & Multi-Category Inventory Management System

A production-grade Point of Sale (POS) and Multi-Category Inventory Management System built with React, Tailwind CSS, Node.js, Express, PostgreSQL, and Sequelize ORM. Features an organic **Mossy Hollow** design system, glassmorphic depth, physical 3D image motion, backend-enforced RBAC, and atomic sales transactions.

---

## 1. Tech Stack

- **Frontend**: React 18, Tailwind CSS, Vite, Framer Motion, Vanilla CSS Design System, React Icons, Axios, React Hot Toast
- **Backend**: Node.js, Express, Sequelize ORM, PostgreSQL (`pg`, `pg-hstore`), JWT, bcryptjs, Multer, Express-Validator
- **Database**: PostgreSQL (Migrations & Models managed via Sequelize CLI)
- **Deployment Targets**: Render (Backend Web Service & Managed PostgreSQL), Vercel (Frontend Single Page Application)

---

## 2. Project Structure

```
final project/
├── backend/
│   ├── config/
│   │   └── database.js               # PostgreSQL Sequelize configuration
│   ├── controllers/
│   │   ├── authController.js         # Register, login, user profile
│   │   ├── productController.js      # Multi-category CRUD, search, low-stock
│   │   ├── posController.js          # SKU lookup, atomic checkout, my-transactions
│   │   ├── userController.js         # Admin staff and role management
│   │   └── statsController.js        # Analytics, revenue, top products
│   ├── middleware/
│   │   ├── auth.js                   # requireAuth & requireRole RBAC middleware
│   │   ├── errorHandler.js           # Centralized AppError JSON handler
│   │   └── validate.js               # express-validator request schemas
│   ├── migrations/
│   │   ├── 20260817000001-create-users.js
│   │   ├── 20260817000002-create-products.js
│   │   ├── 20260817000003-create-transactions.js
│   │   └── 20260817000004-create-transaction-items.js
│   ├── models/
│   │   ├── index.js                  # Model relationships & Sequelize instance
│   │   ├── User.js                   # User entity with bcrypt hooks
│   │   ├── Product.js                # Flat table with category-specific columns
│   │   ├── Transaction.js            # Completed sale ledger with cashier FK
│   │   └── TransactionItem.js        # Transaction line items
│   ├── routes/
│   │   ├── auth.js
│   │   ├── products.js
│   │   ├── pos.js
│   │   ├── users.js
│   │   └── stats.js
│   ├── uploads/                      # Uploaded and seeded product images
│   ├── seed.js                       # Database seed script for roles & products
│   ├── server.js                     # Express entry point
│   ├── .sequelizerc                  # CLI path mapping
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── api/                      # Axios API services
│   │   ├── assets/                   # 3D illustration scenes & icons
│   │   ├── components/
│   │   │   ├── CategoryBadge.jsx     # Category chips
│   │   │   ├── FloatingFrame.jsx     # 3D floating illustration wrapper
│   │   │   ├── Layout.jsx            # Responsive sidebar & role-tinted header
│   │   │   ├── LowStockRail.jsx      # Collapsible low-stock drawer
│   │   │   ├── ProductModal.jsx      # Add/edit product with conditional fields
│   │   │   ├── ProtectedRoute.jsx    # Client-side route guard
│   │   │   ├── ReceiptModal.jsx      # Animated thermal receipt modal
│   │   │   └── Tilt3D.jsx            # Reusable physical 3D mouse tilt & glare
│   │   ├── context/
│   │   │   └── AuthContext.jsx       # Authentication state & JWT persistence
│   │   ├── pages/
│   │   │   ├── AdminDashboard.jsx    # Store-wide overview & KPI cards
│   │   │   ├── CashierPOS.jsx        # 60/40 scan register & live cart
│   │   │   ├── InventoryDashboard.jsx# Category tabs & 3D product cards
│   │   │   ├── Login.jsx             # Parallax 3D login screen
│   │   │   ├── MyTransactions.jsx    # Shift sales history & reprint
│   │   │   ├── StatsPage.jsx         # Analytics & threshold monitoring
│   │   │   └── UserManagement.jsx    # Staff account administration
│   │   ├── App.jsx                   # React Router DOM configuration
│   │   ├── index.css                 # Mossy Hollow 3D design system & Tailwind
│   │   └── main.jsx
│   ├── tailwind.config.js            # Custom color & typography tokens
│   ├── postcss.config.js
│   └── package.json
├── docs/
│   ├── obsidian-vault/               # Complete Obsidian vault documentation
│   └── uml/
│       └── teerop-pos-architecture.mdj # Native StarUML project model
├── promptlog.md                      # AI agent trajectory and prompt log
└── README.md
```

---

## 3. Local Setup & Installation

### Prerequisites
- Node.js (v18 or newer) & npm
- PostgreSQL database server running locally or accessible via cloud (e.g. Render / Supabase)

### Step 1: Clone Repository
```bash
git clone https://github.com/Usman22Siddiqui/POS-and-Inventory-Management.git
cd POS-and-Inventory-Management
```

### Step 2: Backend Setup
```bash
cd backend
npm install

# Create environment configuration (.env)
cp .env.example .env # or configure .env as shown in Section 4

# Run Sequelize Migrations to create database tables
npx sequelize-cli db:migrate

# Populate database with seed users and multi-category products
npm run seed

# Start backend server
npm start # or npm run dev
```

The backend will start on `http://localhost:5000`.

### Step 3: Frontend Setup
```bash
cd ../frontend
npm install

# Start Vite development server
npm run dev
```

The frontend will open on `http://localhost:5173`.

---

## 4. Environment Variables

### Backend (`backend/.env`)
```env
PORT=5000
NODE_ENV=development
JWT_SECRET=your_super_secret_jwt_key_for_teerop_pos_2026
JWT_EXPIRES_IN=24h
TAX_RATE=0.05
FRONTEND_URL=http://localhost:5173

# PostgreSQL Connection
DB_HOST=127.0.0.1
DB_PORT=5432
DB_NAME=teerop_pos
DB_USER=postgres
DB_PASSWORD=your_postgres_password
DB_SSL=false

# Or use unified connection string
# DATABASE_URL=postgres://postgres:password@localhost:5432/teerop_pos
```

### Frontend (`frontend/.env`)
```env
VITE_API_URL=http://localhost:5000/api
```

---

## 5. Seed Test Credentials

The seed script creates 4 user accounts with pre-configured roles:

| Role | Email | Password | Permissions & Dashboard |
|---|---|---|---|
| **Admin** | `admin@teerop.com` | `admin123` | Full access (User management, all inventory CRUD, store-wide analytics, POS register, all transaction visibility). |
| **Inventory Manager** | `manager@teerop.com` | `manager123` | Product catalog CRUD, category-specific fields, image upload, low-stock rail, read-only sales stats. Cannot manage staff. |
| **Cashier 1** | `cashier@teerop.com` | `cashier123` | High-tempo POS register screen and own shift transaction history only. Cannot edit products or access stats. |
| **Cashier 2** | `cashier2@teerop.com` | `cashier123` | Cashier register. Cannot see Cashier 1's transaction history. |

---

## 6. Multi-Category Inventory Specifications

The product catalog uses a single flat table architecture with category-specific nullable columns:

- **Fragile**: `handlingNote` (Text), `isFragile` (Boolean - displays caution chip).
- **Cold**: `expiryDate` (DateOnly, Required), `storageTemp` (Text). Automatically flags items expiring within 3 days.
- **Tech**: `warrantyPeriod` (Integer in months), `serialNumber` (Unique String).
- **Cleaning**: `isHazardous` (Boolean - displays hazard chip), `safetyNote` (Text).
- **General**: Core product attributes (`sku`, `name`, `price`, `quantityInStock`, `reorderThreshold`, `imageUrl`, `description`).

---

## 7. API Reference

### Authentication (`/api/auth`)
- `POST /api/auth/login` — Authenticates credentials and returns JWT token.
- `POST /api/auth/register` — Registers new staff member (Admin only for elevated roles).
- `GET /api/auth/me` — Returns current authenticated user profile.

### Products & Inventory (`/api/products`)
- `GET /api/products` — Paginated list of products (All authenticated roles).
- `GET /api/products/search?name=&sku=&category=` — Filtered product search.
- `GET /api/products/low-stock` — Products where `quantity_in_stock <= reorder_threshold`.
- `GET /api/products/:id` — Single product details.
- `POST /api/products` — Create product with Multer image upload (Admin, Inventory Manager).
- `PUT /api/products/:id` — Update product details (Admin, Inventory Manager).
- `DELETE /api/products/:id` — Delete product (Admin only).

### POS & Billing (`/api/pos`)
- `GET /api/pos/lookup?sku=X` — Quick barcode SKU lookup for scanner input.
- `POST /api/pos/checkout` — Atomic sale transaction. Validates stock, calculates 5% tax, creates Transaction and TransactionItems, and decrements stock inside a single transaction.
- `GET /api/pos/my-transactions` — Scoped sales history (Cashier sees own transactions; Admin sees all).

### Administration & Analytics (`/api/stats` & `/api/users`)
- `GET /api/stats/overview` — Store analytics (Today's revenue, all-time sales, transaction count, top products, low stock count). Restricted to Admin & Inventory Manager.
- `GET /api/users` — List staff accounts (Admin only).
- `PUT /api/users/:id` — Update role or active status (Admin only).
- `DELETE /api/users/:id` — Delete staff account (Admin only).

---

## 8. Deployment Guide

### Backend Deployment (Render)
1. Create a **PostgreSQL Database** on Render. Copy the Internal/External Database URL.
2. Create a new **Web Service** on Render connected to the repository.
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npx sequelize-cli db:migrate && npm start`
3. Add Environment Variables:
   - `DATABASE_URL` = `<Render_Postgres_Connection_String>`
   - `JWT_SECRET` = `<Secure_Random_String>`
   - `FRONTEND_URL` = `https://your-frontend-app.vercel.app`
   - `NODE_ENV` = `production`
   - `DB_SSL` = `true`

### Frontend Deployment (Vercel)
1. Import the Git repository in Vercel.
2. Set **Root Directory** to `frontend`.
3. Framework Preset: **Vite**.
4. Add Environment Variable:
   - `VITE_API_URL` = `https://your-backend-service.onrender.com/api`
5. Deploy.
