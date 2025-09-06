#!/usr/bin/env bash
set -euo pipefail

# --- Generate .env if missing ---
if [ ! -f .env ]; then
cat > .env <<EOF
# Database Configuration
DATABASE_URL=sqlite:///./test.db

# Application Settings
SECRET_KEY=$(openssl rand -hex 32)
DEBUG=True
HOST=0.0.0.0
PORT=8000

# Session Settings
SESSION_EXPIRE_HOURS=24

# Frontend Settings
VITE_API_BASE_URL=http://localhost:8000
EOF
echo ".env file created ✅"
fi

# --- Backend ---
echo "Installing backend deps..."
cd backend
poetry install

echo "Starting backend..."
poetry run make run &
BACKEND_PID=$!
cd ..

# --- Frontend ---
echo "Installing frontend deps..."
cd frontend
npm install

echo "Building frontend..."
npm run build

echo "Starting frontend dev server..."
npm run dev &
FRONTEND_PID=$!
cd ..

# --- Cleanup handler ---
cleanup() {
  echo "Stopping processes..."
  kill $BACKEND_PID $FRONTEND_PID 2>/dev/null || true
}
trap cleanup EXIT

echo "✅ Both frontend and backend running."
echo "Frontend: http://localhost:5173"
echo "Backend:  http://localhost:8000"

# Keep script running to maintain background jobs
wait
