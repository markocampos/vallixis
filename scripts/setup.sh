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

echo "Building frontend..."
npm run build --prefix frontend

echo "Building backend..."
npm run build --prefix backend

echo ""
echo "=== Setup complete ==="
