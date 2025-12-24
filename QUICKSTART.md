# Quick Start Guide

Get Vanish AI running in 5 minutes!

## Prerequisites

- Python 3.10+ installed
- Node.js 18+ installed
- 2GB free disk space

## Installation Steps

### 1. Backend Setup (2 minutes)

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 2. Frontend Setup (1 minute)

```bash
cd frontend
npm install
```

### 3. Run the App (2 minutes)

**Option A: Manual (Two Terminals)**

Terminal 1 - Backend:
```bash
cd backend
source venv/bin/activate
uvicorn main:app --reload --port 8000
```

Terminal 2 - Frontend:
```bash
cd frontend
npm run dev
```

**Option B: Quick Start Script (macOS/Linux)**
```bash
./start.sh
```

## Usage

1. Open http://localhost:5173 in your browser
2. Upload an image (drag & drop or click)
3. Draw on areas you want to remove (red brush)
4. Click "Process Image"
5. Download the result!

## Current Implementation

**Note:** The app currently uses OpenCV's inpainting algorithm, which provides good results for most use cases. For production-quality results similar to Canva, you can integrate the full LaMa model (see TECH_STACK_EVALUATION.md for details).

## Troubleshooting

**Backend won't start:**
- Check Python version: `python --version` (need 3.10+)
- Reinstall dependencies: `pip install -r requirements.txt --force-reinstall`

**Frontend won't start:**
- Check Node version: `node --version` (need 18+)
- Clear cache: `rm -rf node_modules && npm install`

**Port already in use:**
- Backend: Change port in `main.py` or use `--port 8001`
- Frontend: Vite auto-finds next available port

## Next Steps

- Read `SETUP.md` for detailed setup
- Check `TECH_STACK_EVALUATION.md` for tech stack details
- See `PROJECT_STRUCTURE.md` for code organization

Enjoy your Vanish AI! 🪄

