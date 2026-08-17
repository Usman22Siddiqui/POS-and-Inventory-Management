# 📋 Functional Requirements & User Stories

This document specifies the complete functional capabilities of the [[00-Overview/System Architecture|Teerop POS & Inventory System]].

---

## 🔐 1. Authentication & Role-Based Access Control (RBAC)

* **FR-1.1**: The system must provide secure JWT-based authentication ([[03-Implementation/Backend REST API|Backend REST API]]).
* **FR-1.2**: User accounts must belong to one of 3 distinct roles:
  * `admin`: Complete administrative oversight.
  * `inventory_manager`: Catalog and stock operations.
  * `cashier`: Register operations, barcode lookups, and checkout.
* **FR-1.3**: Passwords must be hashed using `bcryptjs` with salt rounds $\ge 10$.

---

## 📦 2. Multi-Category Inventory Management

* **FR-2.1**: Support full CRUD operations across all 5 categories defined in [[01-Requirements/Multi-Category Domain Logic|Multi-Category Domain Logic]].
* **FR-2.2**: Maintain independent stock levels and reorder thresholds.
* **FR-2.3**: Automatically flag items as `Low Stock` when `quantity_in_stock <= reorder_threshold`.
* **FR-2.4**: Support real-time search by product name and SKU.

---

## 🛒 3. Point of Sale (POS) & Checkout

* **FR-3.1**: Case-insensitive barcode lookup via SKU (`frg-001` or `FRG-001`).
* **FR-3.2**: Dynamic cart item stream with real-time subtotal, 5% tax, and total calculation.
* **FR-3.3**: Execute checkout atomically using database transactions ([[03-Implementation/Atomic POS Engine|Atomic POS Engine]]).
* **FR-3.4**: Print and display interactive receipts ([[02-Design/20-Point Animation Suite|Thermal Paper Unroll]]).

---

## 📊 4. Sales & Analytics

* **FR-4.1**: Compute all-time and daily revenue, ticket size, and top-selling products.
* **FR-4.2**: Render interactive [[06-Diagrams/Activity Diagram|Activity Flows]] and live counters.

---

**Related Notes:**
- [[00-Overview/00-Index|Master Navigation]]
- [[01-Requirements/Multi-Category Domain Logic|Multi-Category Domain Logic]]
- [[06-Diagrams/Use Case Diagram|Use Case Diagram]]
