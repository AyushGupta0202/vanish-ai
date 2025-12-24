# Vanish AI - Local Image Inpainting Web App

A fully local web application for removing texts, logos, and graphics from images using AI-powered inpainting. Built with FastAPI, React, and LaMa (Large Mask Inpainting) model.

## Features

- 🎨 Remove texts, logos, and graphics from images
- 🖼️ High-resolution output (maintains original quality)
- 🔒 100% Local processing (no cloud, no costs)
- ⚡ Fast inference with GPU acceleration support
- 🎯 Interactive mask drawing on canvas
- 📥 Download processed images

## Tech Stack

### Backend
- **FastAPI** - Modern Python web framework
- **PyTorch** - Deep learning framework
- **LaMa** - Large Mask Inpainting model
- **OpenCV** - Image processing
- **Pillow** - Image I/O

### Frontend
- **React + TypeScript** - UI framework
- **Tailwind CSS** - Styling
- **Fabric.js** - Canvas manipulation
- **Vite** - Build tool

## Prerequisites

- Python 3.10 or higher
- Node.js 18 or higher
- CUDA-capable GPU (optional, but recommended for faster processing)
- 4GB+ RAM
- 2GB+ free disk space (for models)

## Installation

### 1. Clone and Setup Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 2. Download LaMa Model

The model will be automatically downloaded on first run, or you can download manually:

```bash
cd backend
python scripts/download_model.py
```

### 3. Setup Frontend

```bash
cd frontend
npm install
```

## Running the Application

### Start Backend Server

```bash
cd backend
source venv/bin/activate
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at `http://localhost:8000`
API documentation at `http://localhost:8000/docs`

### Start Frontend Development Server

```bash
cd frontend
npm run dev
```

The app will be available at `http://localhost:5173`

## Usage

1. Upload an image using the drag-and-drop area or file picker
2. Draw on the image to mark areas you want to remove (red brush)
3. Click "Process Image" to apply inpainting
4. Download the processed image

## Project Structure

```
vanish-ai/
├── backend/
│   ├── app/
│   │   ├── models/
│   │   ├── services/
│   │   └── api/
│   ├── main.py
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── hooks/
│   │   └── App.tsx
│   └── package.json
└── README.md
```

## Development

### Backend Development
- API endpoints are auto-documented at `/docs`
- Hot reload enabled in development mode
- Logs show processing time and model info

### Frontend Development
- Hot module replacement enabled
- TypeScript for type safety
- Tailwind CSS for styling

## Performance Tips

- Use GPU acceleration if available (CUDA/Metal)
- For very large images (>4K), consider resizing before processing
- Processing time: 5-30 seconds depending on image size and hardware

## License

MIT License - Free for personal and commercial use

