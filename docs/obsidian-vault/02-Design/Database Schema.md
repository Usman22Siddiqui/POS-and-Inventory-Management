# 🗄️ Relational Database Schema & Architecture

The database architecture is built on **PostgreSQL 16** via Sequelize ORM, with relations mapped in [[06-Diagrams/ER Diagram|ER Diagram]] and [[06-Diagrams/Class Diagram|Class Diagram]].

---

## 📊 Entity Model & Schema Definitions

### 1. `users` Table
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'cashier',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 2. `products` Table
```sql
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    sku VARCHAR(100) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    quantity_in_stock INTEGER NOT NULL DEFAULT 0,
    reorder_threshold INTEGER NOT NULL DEFAULT 5,
    image_url VARCHAR(500),
    description TEXT,
    handling_note TEXT,
    is_fragile BOOLEAN DEFAULT FALSE,
    expiry_date DATE,
    storage_temp VARCHAR(100),
    warranty_period INTEGER,
    serial_number VARCHAR(150),
    is_hazardous BOOLEAN DEFAULT FALSE,
    safety_note TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 3. `transactions` Table
```sql
CREATE TABLE transactions (
    id SERIAL PRIMARY KEY,
    cashier_id INTEGER NOT NULL REFERENCES users(id),
    total_amount DECIMAL(12,2) NOT NULL,
    tax DECIMAL(12,2) NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 4. `transaction_items` Table
```sql
CREATE TABLE transaction_items (
    id SERIAL PRIMARY KEY,
    transaction_id INTEGER NOT NULL REFERENCES transactions(id) ON DELETE CASCADE,
    product_id INTEGER NOT NULL REFERENCES products(id),
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

---

## 🔗 Relational Associations
- `users` (1) ── (N) `transactions`
- `transactions` (1) ── (N) `transaction_items`
- `products` (1) ── (N) `transaction_items`

---

**Related Notes:**
- [[01-Requirements/Multi-Category Domain Logic|Multi-Category Domain Logic]]
- [[03-Implementation/Atomic POS Engine|Atomic POS Engine]]
- [[06-Diagrams/ER Diagram|ER Diagram]]
- [[06-Diagrams/Class Diagram|Class Diagram]]
