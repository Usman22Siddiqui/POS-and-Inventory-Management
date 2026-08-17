# 🛒 Atomic POS Checkout & Decrement Engine

The POS checkout process guarantees **ACID compliance** and atomic inventory protection via Sequelize Managed Database Transactions.

---

## 🔒 Transaction Execution Flow

```mermaid
sequenceDiagram
    autonumber
    actor Cashier
    participant Terminal as POS UI
    participant API as POS Controller
    participant DB as PostgreSQL Transaction
    participant Product as Inventory Stock

    Cashier->>Terminal: Scans SKUs & clicks Charge
    Terminal->>API: POST /api/pos/checkout { items }
    API->>DB: BEGIN TRANSACTION (isolation: READ COMMITTED)
    
    loop For each item in cart
        API->>Product: SELECT quantity_in_stock FOR UPDATE
        alt Insufficient Stock (Stock < Qty)
            API->>DB: ROLLBACK TRANSACTION
            API-->>Terminal: 400 Bad Request (Stock depleted)
        else Stock Available
            API->>Product: UPDATE products SET quantity = quantity - qty
        end
    end

    API->>DB: INSERT INTO transactions
    API->>DB: INSERT INTO transaction_items
    API->>DB: COMMIT TRANSACTION
    API-->>Terminal: 201 Created { transaction, receipt }
    Terminal->>Cashier: Thermal Paper Unroll Receipt
```

---

## 🛡️ Key Guarantees
1. **Zero Stock Corruption**: Stock is NEVER partially decremented if checkout is interrupted.
2. **Case-Insensitive Barcode Engine**: `sequelize.where(sequelize.fn('UPPER', sequelize.col('sku')), cleanSku)` handles lowercase, uppercase, and scanner inputs identically.
3. **Receipt Generation**: Returns exact breakdown with unit prices, calculated 5% tax, and timestamp.

---

**Related Notes:**
- [[02-Design/Database Schema|Database Schema]]
- [[02-Design/20-Point Animation Suite|20-Point Animation Suite]]
- [[06-Diagrams/Sequence Diagrams|Sequence Diagrams]]
- [[06-Diagrams/Activity Diagram|Activity Diagram]]
