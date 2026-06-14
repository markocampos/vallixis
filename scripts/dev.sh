#!/bin/bash

# Resolve the project root (one level up from scripts/)
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/.."

if [ "$NODE_ENV" = "production" ]; then
  echo "❌ Error: This script is for development only! NODE_ENV is set to production."
  exit 1
fi

echo "🚀 Starting Vallixis Development Environment"

# Function to kill processes on a specific port
kill_port() {
  local port=$1
  local pids=$(lsof -t -i:$port 2>/dev/null)
  if [ -n "$pids" ]; then
    echo "⚠️  Found active process(es) on port $port (PID: $pids). Killing..."
    kill -9 $pids
  fi
}

# Clear active ports from past sessions (Backend: 3000, Frontend: 5173)
kill_port 3000
kill_port 5173

echo "✅ Ports cleared."

# Ensure database and redis are running
echo "🟢 Starting backing services (PostgreSQL & Redis)..."
docker-compose -f "$ROOT_DIR/backend/docker-compose.yml" up -d postgres redis

# Start backend in background
echo "🟢 Starting backend on port 3000..."
cd "$ROOT_DIR/backend" && npm run dev &
BACKEND_PID=$!

# Start frontend in background
echo "🟢 Starting frontend on port 5173..."
cd "$ROOT_DIR/frontend" && npm run dev &
FRONTEND_PID=$!

echo "✨ Vallixis is running! Press Ctrl+C to stop both servers."

# Trap SIGINT (Ctrl+C) to kill both processes gracefully
trap "echo '🛑 Stopping Vallixis...'; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit" SIGINT SIGTERM

# Wait for background processes to keep script running
wait $BACKEND_PID $FRONTEND_PID
