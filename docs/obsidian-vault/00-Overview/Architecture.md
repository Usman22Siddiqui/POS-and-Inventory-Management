# System Architecture

## Architecture Overview
Teerop POS utilizes a decoupled client-server architecture:

```mermaid
graph TD
    subgraph Client Tier - React + Vite
        UI[Mossy Hollow UI]
        POS[Cashier Terminal]
        INV[Inventory Operations]
        ADM[Admin Portal]
        State[Auth & State Context]
    end

    subgraph API Gateway - Express
        AuthMW[JWT & RBAC Middleware]
        ValMW[Express-Validator Middleware]
        Uploads[Multer File Storage]
        Routes[API Route Handlers]
    end

    subgraph Data & ORM Tier
        ORM[Sequelize ORM]
        DB[(SQLite / PostgreSQL)]
    end

    UI --> AuthMW
    POS --> AuthMW
    INV --> AuthMW
    ADM --> AuthMW
    AuthMW --> ValMW
    ValMW --> Routes
    Routes --> ORM
    ORM --> DB
```

### Tech Stack Details
1. **Frontend**: React 18, Vite, Framer Motion, Vanilla CSS Design System, React Icons, Axios.
2. **Backend**: Node.js, Express, Sequelize ORM, JWT, Bcrypt, Multer, Express-Validator.
3. **Database**: SQLite (Local Development) / PostgreSQL (Production on Render).
