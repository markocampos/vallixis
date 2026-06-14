# Vallixis

Managed website hosting for solo entrepreneurs. Built with React, Node.js,
PostgreSQL, and PayMongo.

## Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 15
- Redis 7 (for analytics and queue)
- Docker + Docker Compose (optional, for containerized setup)

### 1. Clone and Install
```bash
git clone https://github.com/yourorg/vallixis.git
cd vallixis
npm install
```

### 2. Environment Variables
```bash
cp frontend/.env.example frontend/.env
cp backend/.env.example backend/.env
```

Fill in the backend .env:
```
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://vallixis:vallixis@localhost:5432/vallixis
JWT_SECRET=(generate with openssl rand -hex 32)
JWT_EXPIRY=24h
REFRESH_TOKEN_EXPIRY=7d
BCRYPT_ROUNDS=12
ENCRYPTION_KEY=(generate with openssl rand -hex 32)
SMTP_HOST=smtp.mailgun.org
SMTP_PORT=587
SMTP_USER=postmaster@vallixis.io
SMTP_PASS=your_smtp_password
SMTP_FROM=hello@vallixis.io
PAYMONGO_SECRET_KEY=sk_test_...
PAYMONGO_PUBLIC_KEY=pk_test_...
PAYMONGO_WEBHOOK_SECRET=whsec_...
REDIS_URL=redis://localhost:6379
FRONTEND_URL=http://localhost:5173
API_URL=http://localhost:3000
CADDY_API=http://localhost:2019
ADMIN_EMAIL=admin@vallixis.io
ADMIN_PASSWORD=ChangeMe123!
```

### 3. Database Setup
```bash
# Create database
createdb vallixis

# Run migrations
npm run migrate

# Seed admin user
npm run seed:admin
```

### 4. Start Services

Option A: Docker Compose (recommended)
```bash
docker-compose up
```
This starts: PostgreSQL, Redis, Caddy, backend, frontend.

Option B: Manual
```bash
# Terminal 1: PostgreSQL (if not running as service)
pg_ctl start

# Terminal 2: Redis
redis-server

# Terminal 3: Backend
cd backend
npm run dev

# Terminal 4: Frontend
cd frontend
npm run dev

# Terminal 5: Caddy (optional, for local SSL testing)
caddy run
```

### 5. Verify
- Frontend: http://localhost:5173
- API: http://localhost:3000/v1/health
- Admin: http://localhost:5173/admin (login with ADMIN_EMAIL/PASSWORD)

### 6. Run Tests
```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Coverage
npm run test:coverage
```

## Project Structure
```
vallixis/
  frontend/          React 18 + Vite + Tailwind
  backend/           Node.js + Express + PostgreSQL
  shared/            Shared TypeScript types
  scripts/           Deployment and setup scripts
  docs/              Documentation
```

## Scripts
```bash
npm run setup        # Full setup (DB, env, seed)
npm run deploy       # Production deployment
npm run backup       # Database backup
```

## Contributing
See CONTRIBUTING.md for guidelines.

## License
MIT
# vallixis
