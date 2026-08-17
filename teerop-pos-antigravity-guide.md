# Teerop POS & Inventory System — Antigravity Build Guide

How to direct Antigravity through all 7 phases properly: what to paste, what to check
after each phase, and how to keep the prompt log you have to submit.

**Golden rule:** never paste the whole spec and say "build it." Feed one phase at a
time. Read the diff/files it generates before moving on. Test in Postman/browser
after every phase. Save every prompt you send — that's your deliverable #4.

---

## Step 0 — Project brief (paste this once, at the very start, as context)

Paste this as your first message to Antigravity so it has the full picture before
you start scoping phases. Don't ask it to act on all of it yet — just give it context.

```
I'm building a Multi-Category POS & Inventory Management System.

Stack: React + Tailwind CSS (frontend), Node.js + Express (backend),
PostgreSQL + Sequelize (ORM), JWT + bcrypt (auth), Multer (file uploads).
Deploy target: Render (backend), Vercel (frontend).

Three roles, enforced on the BACKEND via middleware (not just hidden UI):
- Admin: manage users, all inventory, store-wide reports. Full access.
- Inventory Manager: CRUD products across categories, restock, set reorder
  thresholds, view low-stock alerts, read-only sales history. Cannot manage users.
- Cashier: billing/POS screen only + their own transaction history. Cannot edit
  products/prices/categories. Cannot see other cashiers' full sales data.

Product base fields: SKU/barcode (unique), name, category (enum: Fragile, Cold,
Tech, Cleaning, General), price, quantityInStock (int, >=0), reorderThreshold
(int), imageUrl, description (optional).

Category-specific extra fields:
- Fragile: handlingNote (text), isFragile (boolean, shown as warning badge)
- Cold: expiryDate (date, required), storageTemp (text), auto-flag items
  expiring within 3 days
- Tech: warrantyPeriod (months), serialNumber (unique text)
- Cleaning: isHazardous (boolean, warning badge), safetyNote (text)
- General: no extra fields

Two new tables beyond a normal product/user setup: Transaction (id, cashierId,
timestamp, totalAmount, tax) and TransactionItem (id, transactionId, productId,
quantity, unitPrice, subtotal).

I will feed you one phase at a time. Don't scaffold ahead of what I ask for in
each prompt. After each phase I'll test before continuing, so keep changes scoped
to what I request.
```

Save this file locally too — it's your Phase 1 planning artifact for the prompt log.

---

## Phase 1 — Planning & schema (do this largely yourself, lightly with the agent)

Prompt to Antigravity:

```
Based on the project brief above, propose a Sequelize schema for these tables:
User, Product, Transaction, TransactionItem. Use a single Product table with
nullable category-specific columns rather than per-category child tables (I want
one flat table, not subtype tables). Show me the model definitions and
associations only — do not scaffold the whole project yet. Explain the
relationships (User hasMany Transaction, Transaction hasMany TransactionItem,
TransactionItem belongsTo Product, etc.) before writing code.
```

**Review checklist before moving on:**
- [ ] Foreign keys and associations make sense (Transaction ↔ TransactionItem ↔ Product)
- [ ] `quantityInStock` has a check constraint or app-level guard against going negative
- [ ] Category is an ENUM, not a free-text string
- [ ] You understand every field it proposed — if not, ask it to explain, don't just accept

---

## Phase 2 — Backend core

```
Set up the Express server structure: server.js entry point, PostgreSQL connection
via Sequelize, and migrations for the User, Product, Transaction, and
TransactionItem models we defined in Phase 1. Add basic CRUD routes for Product
only (not User/auth yet — that's the next phase). Include centralized error-
handling middleware and input validation (e.g. via express-validator or Joi) on
the Product create/update routes. Don't add authentication yet.
```

**Review checklist:**
- [ ] Migrations actually run (`npx sequelize-cli db:migrate`) without errors
- [ ] Error handler catches thrown errors and returns consistent JSON shape
- [ ] Validation rejects missing/malformed fields (test with a bad POST in Postman)
- [ ] Test every CRUD route in Postman before Phase 3

---

## Phase 3 — Authentication & role middleware

```
Add authentication: User model with bcrypt-hashed passwords, POST /register and
POST /login issuing JWTs, and role-based middleware (requireAuth,
requireRole(['admin']) style) that I can attach to routes. Apply requireAuth +
requireRole to the Product routes from Phase 2: Admin and Inventory Manager can
write, all authenticated roles can read. Show me the middleware code and how it's
applied — don't touch the frontend yet.
```

**Review checklist (this is graded explicitly, test it don't skip it):**
- [ ] Log in as each of the 3 roles, grab each JWT
- [ ] Try hitting an Inventory-Manager-only route with a Cashier token → must get 403
- [ ] Passwords are actually hashed in the DB, not plaintext
- [ ] JWT expiry is set to something sane (not infinite)

---

## Phase 4 — Inventory module

```
Build full CRUD for products with category-specific conditional fields: when
category is Fragile, accept handlingNote + isFragile; Cold accepts expiryDate +
storageTemp; Tech accepts warrantyPeriod + serialNumber; Cleaning accepts
isHazardous + safetyNote; General accepts no extra fields. Add Multer image
upload (local storage) attached to product create/update. Add a search/filter
endpoint: GET /products/search?name=&sku=&category=. Add a GET /products/low-stock
endpoint returning products where quantityInStock <= reorderThreshold. Restrict
writes to Admin/Inventory Manager, reads to any authenticated role.
```

**Review checklist:**
- [ ] Submitting a Fragile product with a Cold field (e.g. expiryDate) is rejected or ignored, not silently saved
- [ ] Image upload actually returns a usable URL/path saved on the product
- [ ] Low-stock endpoint returns correct items — seed a product right at threshold to confirm the `<=`
- [ ] Search works on partial name match, exact SKU, and category filter combined

---

## Phase 5 — Billing / POS module

```
Build the billing module: POST /pos/lookup?sku=X returning name, price, category,
currentStock for a scanned/typed SKU. A cart is managed client-side but validated
server-side at checkout. POST /pos/checkout accepts { items: [{productId,
quantity}], cashierId } and: (1) verifies stock is sufficient for every line item,
rejecting the whole transaction with a clear message if not, (2) creates a
Transaction + TransactionItem rows, (3) decrements product stock, all inside a
single Sequelize transaction so it can't partially apply. Compute tax at a flat
5% (document this rate in a comment). Add GET /pos/my-transactions restricted to
the logged-in cashier's own transactions (or Admin, who sees all).
```

**Review checklist:**
- [ ] Try to check out more of an item than is in stock → clean rejection, no partial stock decrement
- [ ] Kill the request mid-way (or reason about the code) — confirm it's wrapped in `sequelize.transaction()`
- [ ] Cashier A cannot see Cashier B's transactions via the my-transactions endpoint
- [ ] Tax rate is applied consistently and documented somewhere (README or code comment)

---

## Phase 6 — Frontend (React)

```
Build the React frontend: React Router setup, login/register pages, and three
protected dashboards (Admin, Inventory Manager, Cashier) that redirect based on
JWT role. For the Cashier POS screen: a focused SKU input that on Enter looks up
the item, adds it to cart, clears itself, and refocuses automatically; a name-
search fallback; a live cart table with quantity adjust/remove, subtotal, tax,
and grand total; a checkout button calling POS/checkout and showing a receipt.
Use Tailwind CSS throughout. Make sure the POS screen is usable at tablet width
(min ~768px), not just desktop.
```

**Review checklist:**
- [ ] Log in as each role, confirm you land on the right dashboard and can't manually navigate into another role's route
- [ ] Scanner input actually refocuses after each Enter — test the full flow of scanning 3+ items in a row
- [ ] Resize to tablet width and check the POS screen doesn't break
- [ ] Insufficient-stock message actually shows in the UI, not just the API response

---

## Phase 7 — Stats, polish, deploy

```
Add a stats page: total sales (today and all-time), transaction count, top-
selling products (by quantity sold), and the low-stock list — Admin and
Inventory Manager can view, Cashier cannot. Then do a final responsive pass
across all three dashboards. Prepare for deployment: document all required
environment variables in a README (DB connection string, JWT secret, PORT,
etc.), and give me the steps to deploy the backend to Render and frontend to
Vercel, including any CORS config needed between them.
```

**Review checklist:**
- [ ] Stats numbers match what you'd expect from your seeded test transactions (do the math by hand once)
- [ ] Cashier role genuinely cannot reach the stats page (backend-enforced, test via direct API call too)
- [ ] README has every env var, plus seed login credentials for all 3 roles (required deliverable)
- [ ] Live Render + Vercel links actually work end-to-end after deploy — test the full billing flow live, not just locally

---

## Keeping the prompt log (Deliverable #4)

Antigravity should have a session/export history — check its settings for an
export option. If not, just keep a running text file and paste each prompt you
send into it as you go, plus a one-line note on what you had to correct
("agent forgot to hash password on /register, re-prompted with fix" etc.).
Graders specifically want to see corrections, not just prompts — so don't skip
noting what you caught and fixed.

## Final pre-submission checklist

- [ ] All 3 roles tested end-to-end, including a full billing transaction that
      correctly updates stock
- [ ] Role restrictions verified on the backend via direct API calls, not just UI
- [ ] Category-specific fields store/display correctly for all 5 categories
- [ ] Stock never goes negative (tried to force it and confirmed it's blocked)
- [ ] Totals (subtotal, tax, grand total) calculated correctly
- [ ] Both Render and Vercel links live and reachable
- [ ] Prompt log included, showing scoped phase-by-phase prompts + corrections
- [ ] Recorded demo walks through all 3 roles + one full billing transaction
