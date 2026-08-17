# 🧪 Test Strategy & Quality Verification Plan

This document outlines the testing strategy, test scenarios, and regression verification for the Teerop POS system.

---

## 🎯 Testing Dimensions

### 1. 🔐 Authentication & RBAC Tests
- ✅ Admin user can access `/admin`, `/inventory`, `/pos`, `/users`, `/stats`.
- ✅ Inventory Manager cannot access `/users` (403 Forbidden).
- ✅ Cashier cannot access `/users` or `/admin` (403 Forbidden).
- ✅ Expired or invalid JWT tokens redirect cleanly to `/login`.

### 2. 📦 Multi-Category Inventory Validation
- ✅ Cold category requires expiration date and chill temperature.
- ✅ Fragile category requires special handling notes.
- ✅ Tech category requires warranty months and serial number.
- ✅ Cleaning category requires chemical hazard notes.

### 3. 🛒 Atomic Checkout & Edge Cases
- ✅ Case-insensitive barcode lookup matches `FRG-001`, `frg-001`, and `Frg-001`.
- ✅ Checkout decrements inventory stock accurately.
- ✅ Checkout fails cleanly and rolls back if an item has 0 stock.
- ✅ Receipt displays accurate itemized rows, 5% tax, and total.

---

**Related Notes:**
- [[01-Requirements/Functional Requirements|Functional Requirements]]
- [[03-Implementation/Atomic POS Engine|Atomic POS Engine]]
- [[05-Deployment/DevOps & Docker Containers|DevOps & Docker Containers]]
