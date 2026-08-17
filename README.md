# Teerop POS & Multi-Category Inventory Management System

A high-performance Point of Sale (POS) and Inventory Management System designed with a warm, organic **"Mossy Hollow"** design language, glassmorphism accents, tactile animations, and robust backend-enforced role-based access control.

---

## 🎨 Visual Identity — "Mossy Hollow"

| Token | Hex Value | Purpose |
|---|---|---|
| `--moss-primary` | `#636B2F` | Primary actions, Admin topbar, key highlights |
| `--moss-sage` | `#BAC095` | Secondary surfaces, Inventory Manager topbar |
| `--moss-lime` | `#D4DE95` | POS Terminal topbar, success indicators |
| `--moss-deep` | `#3D4127` | High-contrast headers, typography, buttons |
| `--bg-canvas` | `#F7F8F1` | Warm canvas background |
| `--danger` | `#A6493B` | Muted brick red for hazardous alerts & stock warnings |
| `--warning` | `#C99A3C` | Amber ochre for low-stock thresholds & near-expiry flags |

---

## 🚀 Key Features

1. **Role-Based Access Control (RBAC)**:
   - **Admin** (`admin@teerop.com`): Full access to user management, catalog, register, and store-wide revenue analytics.
   - **Inventory Manager** (`manager@teerop.com`): Catalog CRUD, category-specific fields, image uploads, low-stock drawer, and velocity metrics.
   - **Cashier** (`cashier@teerop.com`): High-speed POS register and shift transaction history.

2. **Category-Specific Product Attributes**:
   - **Fragile**: Handling notes & fragile warning badge.
   - **Cold**: Required expiration date, storage temperature, and auto-flagging for items expiring within 3 days.
   - **Tech**: Warranty duration in months and unique serial numbers.
   - **Cleaning**: Hazardous chemical badge and safety precaution notes.
   - **General**: Base inventory attributes.

3. **Signature Scan-to-Cart Experience**:
   - Sub-50ms barcode lookup with fallback name search.
   - **Tactile Settle Animation**: Items land in the cart with a 200ms spring settle.
   - Auto-refocus scanner input for rapid continuous scanning.
   - Live mono-numeral running subtotal, flat 5% tax, and grand total.

4. **Atomic Checkout Engine**:
   - Complete checkout rollback via Sequelize managed transactions if any line item exceeds available stock.
   - Instant thermal paper receipt generation with roll-out animation.

---

## 📦 Default Seed Credentials

| Role | Email | Password |
|---|---|---|
| **Admin** | `admin@teerop.com` | `admin123` |
| **Inventory Manager** | `manager@teerop.com` | `manager123` |
| **Cashier 1** | `cashier@teerop.com` | `cashier123` |
| **Cashier 2** | `cashier2@teerop.com` | `cashier123` |

---

## 🛠️ Local Installation & Running

### 1. Backend Setup
```bash
cd backend
npm install
node seed.js      # Populates database with sample inventory & roles
npm start         # Starts backend API on http://localhost:5000
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev       # Starts Vite dev server on http://localhost:5173
```

---

## 🌐 Environment Variables

### Backend (`backend/.env`)
```ini
PORT=5000
NODE_ENV=development
JWT_SECRET=teerop-pos-secret-key-change-in-production-2024
JWT_EXPIRES_IN=24h
TAX_RATE=0.05
FRONTEND_URL=http://localhost:5173
```

### Production PostgreSQL (`Render`)
```ini
DB_HOST=your-postgres-host.render.com
DB_PORT=5432
DB_NAME=teerop_pos
DB_USER=postgres
DB_PASSWORD=your_secure_password
DB_SSL=true
```

---

## 📁 Deliverables & Documentation

- **Obsidian Vault**: `docs/obsidian-vault/` (Complete Markdown notes with Mermaid diagrams).
- **StarUML Architecture Model**: `docs/uml/teerop-pos-architecture.mdj`.
- **Prompt Log**: `PROMPT_LOG.md` (Deliverable #4 with corrections record).
- **Generated 3D Assets**: `frontend/src/assets/illustrations/`.
