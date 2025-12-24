#!/bin/bash

# Vanish AI Startup Script
echo "🪄 Starting Vanish AI..."
echo ""

# Check if virtual environment exists
if [ ! -d "backend/venv" ]; then
    echo "❌ Backend virtual environment not found!"
    echo "Please run: cd backend && python -m venv venv && source venv/bin/activate && pip install -r requirements.txt"
    exit 1
fi

# Check if node_modules exists
if [ ! -d "frontend/node_modules" ]; then
    echo "❌ Frontend dependencies not installed!"
    echo "Please run: cd frontend && npm install"
    exit 1
fi

echo "✅ Dependencies check passed"
echo ""
echo "Starting backend server..."
cd backend
source venv/bin/activate
uvicorn main:app --reload --host 0.0.0.0 --port 8000 &
BACKEND_PID=$!

echo "Backend started (PID: $BACKEND_PID)"
echo ""
echo "Starting frontend server..."
cd ../frontend
npm run dev &
FRONTEND_PID=$!

echo "Frontend started (PID: $FRONTEND_PID)"
echo ""
echo "✅ Vanish AI is running!"
echo "   Frontend: http://localhost:5173"
echo "   Backend:  http://localhost:8000"
echo "   API Docs: http://localhost:8000/docs"
echo ""
echo "Press Ctrl+C to stop both servers"

# Wait for interrupt
trap "kill $BACKEND_PID $FRONTEND_PID; exit" INT
wait

