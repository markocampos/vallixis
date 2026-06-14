#!/bin/bash
set -e

echo "=== Vallixis Setup ==="

# Create required directories
mkdir -p /tmp/vallixis/sites
mkdir -p /tmp/vallixis/backups
mkdir -p /tmp/vallixis/queue

echo "✓ Created runtime directories"

# Copy .env.example to .env if not exists
if [ ! -f backend/.env ]; then
  cp backend/.env.example backend/.env
  echo "✓ Created backend/.env (please update with real values)"
fi

if [ ! -f frontend/.env ]; then
  cp frontend/.env.example frontend/.env
  echo "✓ Created frontend/.env"
fi

# Install dependencies
echo "Installing backend dependencies..."
npm install --prefix backend

echo "Installing frontend dependencies..."
npm install --prefix frontend

echo ""
echo "=== Setup complete ==="
echo ""
echo "Next steps:"
echo "  1. Update backend/.env with your database and API credentials"
echo "  2. Start PostgreSQL and Redis: cd backend && docker-compose up -d postgres redis"
echo "  3. Run migrations: cd backend && npm run migrate"
echo "  4. Seed admin: cd backend && npm run seed:admin"
echo "  5. Start backend: npm run dev:backend"
echo "  6. Start frontend: npm run dev:frontend"
