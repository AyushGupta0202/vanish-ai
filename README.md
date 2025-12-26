<div align="center">

# 🎨 Vanish AI

**AI-Powered Image Inpainting | Remove Text, Logos & Graphics Seamlessly**

[![CI/CD](https://github.com/ayushgupta0202/vanish-ai/workflows/CI/CD%20Pipeline/badge.svg)](https://github.com/ayushgupta0202/vanish-ai/actions)
[![Release](https://github.com/ayushgupta0202/vanish-ai/workflows/Automated%20Release/badge.svg)](https://github.com/ayushgupta0202/vanish-ai/releases)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Python](https://img.shields.io/badge/Python-3.10+-blue.svg)](https://www.python.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.2+-blue.svg)](https://www.typescriptlang.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.104+-green.svg)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-18.2+-blue.svg)](https://react.dev/)
[![CodeQL](https://github.com/ayushgupta0202/vanish-ai/workflows/CodeQL%20Analysis/badge.svg)](https://github.com/ayushgupta0202/vanish-ai/security/code-scanning)

[🚀 Features](#-features) • [📦 Installation](#-installation) • [💻 Usage](#-usage) • [🔧 Tech Stack](#-tech-stack) • [📚 Documentation](#-documentation) • [🤝 Contributing](#-contributing) • [📄 License](#-license)

</div>

---

## 🎯 Overview

**Vanish AI** is a production-ready, fully local web application for removing texts, logos, watermarks, and unwanted graphics from images using state-of-the-art AI-powered inpainting. Built with **FastAPI**, **React**, and the **LaMa (Large Mask Inpainting)** model, it delivers professional-grade results without cloud dependencies or subscription costs.

### ✨ Key Highlights

- 🔒 **100% Local Processing** - Your images never leave your machine
- ⚡ **GPU Accelerated** - CUDA/Metal support for lightning-fast inference
- 🎨 **Professional Quality** - High-resolution output maintaining original image quality
- 🖱️ **Intuitive Interface** - Interactive canvas with brush, hand, and auto-detection tools
- 🚀 **Production Ready** - Docker support, CI/CD pipelines, automated releases
- 📱 **Modern Stack** - TypeScript, React 18, FastAPI, Tailwind CSS

---

## 🚀 Features

### Core Capabilities

- 🎨 **Smart Inpainting** - Remove texts, logos, watermarks, and graphics seamlessly
- 🖼️ **High-Resolution Output** - Maintains original image quality up to 4K
- 🔍 **Auto-Detection** - AI-powered text detection with OCR integration
- 🖌️ **Interactive Canvas** - Brush, hand, and selection tools for precise masking
- 📥 **Export Options** - Download processed images in original quality
- 🔄 **History Management** - Undo/redo functionality for workflow efficiency

### Advanced Features

- ⚡ **GPU Acceleration** - Automatic CUDA/Metal detection and utilization
- 🎯 **Selective Processing** - Process only selected regions for faster results
- 📊 **Real-time Preview** - See changes before final processing
- 🔧 **Configurable Detection** - Adjustable confidence thresholds and mask expansion
- 🐳 **Docker Support** - One-command deployment with Docker Compose
- 🌐 **RESTful API** - Full API documentation with OpenAPI/Swagger

---

## 📦 Installation

### Prerequisites

- **Python** 3.10 or higher
- **Node.js** 18 or higher
- **CUDA-capable GPU** (optional, but recommended for faster processing)
- **4GB+ RAM**
- **2GB+ free disk space** (for models)

### Quick Start

```bash
# Clone the repository
git clone https://github.com/ayushgupta0202/vanish-ai.git
cd vanish-ai

# Backend setup
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt

# Download LaMa model (automatic on first run)
python scripts/download_model.py

# Frontend setup
cd ../frontend
npm install

# Start backend (Terminal 1)
cd backend
source venv/bin/activate
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# Start frontend (Terminal 2)
cd frontend
npm run dev
```

Visit `http://localhost:5173` to use the application.

### Docker Deployment

```bash
# Build and run with Docker Compose
docker-compose up --build

# Or use the start script
./start.sh
```

---

## 💻 Usage

### Basic Workflow

1. **Upload Image** - Drag and drop or select an image file (max 50MB)
2. **Mark Areas** - Use the brush tool to mark areas you want to remove
3. **Auto-Detect** (Optional) - Click "Auto Detect" to automatically find text
4. **Process** - Click "Process Image" to apply AI inpainting
5. **Download** - Save the processed image

### Tools

- **🖌️ Brush Tool** - Draw masks manually with adjustable brush size
- **✋ Hand Tool** - Pan and drag the canvas for better positioning
- **🔍 Auto Detect** - AI-powered text detection with OCR
- **↩️ Undo/Redo** - Navigate through edit history

### API Usage

```python
import requests

# Upload image
with open('image.jpg', 'rb') as f:
    response = requests.post('http://localhost:8000/api/upload', files={'file': f})
    data = response.json()

# Process image
response = requests.post('http://localhost:8000/api/process', json={
    'image': data['image'],
    'mask': mask_base64
})
```

Full API documentation available at `http://localhost:8000/docs`

---

## 🔧 Tech Stack

### Backend
- **[FastAPI](https://fastapi.tiangolo.com/)** - Modern, fast Python web framework
- **[PyTorch](https://pytorch.org/)** - Deep learning framework
- **[LaMa](https://github.com/saic-mdal/lama)** - Large Mask Inpainting model
- **[OpenCV](https://opencv.org/)** - Image processing and computer vision
- **[Pillow](https://python-pillow.org/)** - Image I/O and manipulation
- **[PaddleOCR](https://github.com/PaddlePaddle/PaddleOCR)** - OCR for text detection

### Frontend
- **[React 18](https://react.dev/)** - UI framework with hooks
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe JavaScript
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Fabric.js](http://fabricjs.com/)** - Canvas manipulation library
- **[Vite](https://vitejs.dev/)** - Next-generation build tool
- **[Zustand](https://github.com/pmndrs/zustand)** - Lightweight state management
- **[Axios](https://axios-http.com/)** - HTTP client

### DevOps & Automation
- **[GitHub Actions](https://github.com/features/actions)** - CI/CD pipelines
- **[Docker](https://www.docker.com/)** - Containerization
- **[Dependabot](https://github.com/dependabot)** - Automated dependency updates
- **[CodeQL](https://codeql.github.com/)** - Security analysis

---

## 📚 Documentation

- **[Quick Start Guide](QUICKSTART.md)** - Get up and running in 5 minutes
- **[Setup Instructions](SETUP.md)** - Detailed installation guide
- **[API Documentation](http://localhost:8000/docs)** - Interactive API docs (when running)
- **[Contributing Guide](CONTRIBUTING.md)** - How to contribute to the project
- **[Changelog](CHANGELOG.md)** - Version history and updates

---

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Quick Contribution Steps

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Commit Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes
- `refactor:` Code refactoring
- `perf:` Performance improvements
- `test:` Adding tests
- `chore:` Maintenance tasks

---

## 📊 Project Structure

```
vanish-ai/
├── .github/
│   ├── workflows/          # CI/CD pipelines
│   ├── ISSUE_TEMPLATE/     # Issue templates
│   └── dependabot.yml      # Dependency updates
├── backend/
│   ├── app/
│   │   ├── services/       # Core services
│   │   │   ├── inpainting.py
│   │   │   ├── text_detection.py
│   │   │   └── smart_mask.py
│   │   └── __init__.py
│   ├── scripts/            # Utility scripts
│   ├── main.py             # FastAPI application
│   └── requirements.txt    # Python dependencies
├── frontend/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── store/          # State management
│   │   └── App.tsx         # Main app component
│   └── package.json        # Node dependencies
├── docker-compose.yml      # Docker Compose config
├── Dockerfile              # Docker image definition
└── README.md               # This file
```

---

## 🎯 Performance Tips

- **GPU Acceleration**: Enable CUDA/Metal for 5-10x faster processing
- **Image Optimization**: Large images (>4K) are automatically resized
- **Selective Processing**: Process only selected regions for faster results
- **Batch Processing**: Use the API for programmatic batch operations

**Typical Processing Times:**
- Small images (<1MP): 2-5 seconds
- Medium images (1-4MP): 5-15 seconds
- Large images (4-16MP): 15-30 seconds
- Very large images (>16MP): 30-60 seconds

*Times vary based on hardware and GPU availability*

---

## 🔒 Security & Privacy

- ✅ **100% Local Processing** - Images never leave your machine
- ✅ **No Cloud Dependencies** - No external API calls
- ✅ **No Data Collection** - Zero telemetry or analytics
- ✅ **Open Source** - Fully auditable codebase
- ✅ **Regular Security Scans** - Automated CodeQL analysis

---

## 📈 Roadmap

- [ ] Multi-image batch processing
- [ ] Advanced mask refinement tools
- [ ] Custom model training support
- [ ] Real-time collaboration features
- [ ] Mobile app (React Native)
- [ ] Plugin system for extensibility
- [ ] WebAssembly acceleration
- [ ] Cloud deployment templates

---

## 🏆 Acknowledgments

- **[LaMa](https://github.com/saic-mdal/lama)** - Large Mask Inpainting model
- **[PaddleOCR](https://github.com/PaddlePaddle/PaddleOCR)** - OCR engine
- **[FastAPI](https://fastapi.tiangolo.com/)** - Web framework
- **[React](https://react.dev/)** - UI framework
- All contributors and open-source maintainers

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

**Free for personal and commercial use.**

---

## 🌟 Star History

[![Star History Chart](https://api.star-history.com/svg?repos=ayushgupta0202/vanish-ai&type=Date)](https://star-history.com/#ayushgupta0202/vanish-ai&Date)

---

<div align="center">

**Made with ❤️ by the Vanish AI Team**

[⭐ Star us on GitHub](https://github.com/ayushgupta0202/vanish-ai) • [🐛 Report Bug](https://github.com/ayushgupta0202/vanish-ai/issues) • [💡 Request Feature](https://github.com/ayushgupta0202/vanish-ai/issues) • [📖 Documentation](https://github.com/ayushgupta0202/vanish-ai#-documentation)

</div>
