# Setup Instructions

## Quick Start Guide

Follow these steps to get Vanish AI running locally.

### Prerequisites Check

```bash
# Check Python version (need 3.10+)
python --version

# Check Node.js version (need 18+)
node --version
```

### Step 1: Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On macOS/Linux:
source venv/bin/activate
# On Windows:
# venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

### Step 2: Frontend Setup

```bash
# Navigate to frontend directory (from project root)
cd frontend

# Install dependencies
npm install
```

### Step 3: Run the Application

**Terminal 1 - Backend:**
```bash
cd backend
source venv/bin/activate  # On Windows: venv\Scripts\activate
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### Step 4: Access the App

- Frontend: http://localhost:5173
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

## Troubleshooting

### Backend Issues

**Port already in use:**
```bash
# Change port in main.py or use:
uvicorn main:app --reload --port 8001
```

**Missing dependencies:**
```bash
pip install --upgrade pip
pip install -r requirements.txt --force-reinstall
```

**CUDA/GPU issues:**
- The app works on CPU, but GPU is faster
- Check CUDA: `python -c "import torch; print(torch.cuda.is_available())"`
- For Apple Silicon, PyTorch uses MPS automatically

### Frontend Issues

**Port already in use:**
- Vite will automatically use next available port
- Or change in `vite.config.ts`

**Module not found:**
```bash
rm -rf node_modules package-lock.json
npm install
```

**Canvas/Fabric.js issues:**
- Make sure you're using a modern browser (Chrome, Firefox, Safari latest)
- Check browser console for errors

## Performance Tips

1. **GPU Acceleration:** Install CUDA-enabled PyTorch for NVIDIA GPUs
2. **Image Size:** For very large images (>4K), consider resizing first
3. **Processing Time:** Expect 5-30 seconds depending on image size and hardware

## Next Steps

- Implement full LaMa model for better quality (see TECH_STACK_EVALUATION.md)
- Add automatic text detection with PaddleOCR
- Add batch processing for multiple images

