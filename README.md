# YOLOv11 Image Search - Full-Stack Web Application

A professional computer vision-powered search application built with **React frontend**, **Node.js/Express backend**, and **YOLOv11** for intelligent object detection.

## 🎯 Architecture

```
React Frontend (Port 3000)
    ↓ REST API
Express Backend (Port 5000)
    ↓ Python Shell
YOLOv11 Inference (Python)
```

## ✨ Features

### Core Functionality
- ✅ YOLOv11 object detection on images
- ✅ Batch processing from directories
- ✅ File upload and processing
- ✅ Metadata extraction and management
- ✅ Intelligent search with multiple modes
- ✅ Confidence threshold configuration

### Full-Stack Features
- ✅ Modern React web interface
- ✅ REST API with 7 endpoints
- ✅ Real-time async processing
- ✅ Responsive mobile design
- ✅ Docker containerization
- ✅ Production-ready architecture

## 🚀 Quick Start

### Prerequisites
- **Node.js** 16+ (from https://nodejs.org)
- **Python** 3.8+
- **pip** (Python package manager)

### Installation (5 minutes)

```powershell
# 1. Install Python packages
pip install -r requirements.txt

# 2. Install backend dependencies
cd backend
npm install
cd ..

# 3. Install frontend dependencies
cd frontend
npm install
cd ..
```

### Running the Application

**Terminal 1 - Backend**
```powershell
cd backend
npm start
```

**Terminal 2 - Frontend**
```powershell
cd frontend
npm start
```

Visit **http://localhost:3000** - it will open automatically!

## 📚 Documentation

| Document | Purpose |
|----------|---------|
| [QUICKSTART.md](QUICKSTART.md) | 5-minute setup guide |
| [SETUP.md](SETUP.md) | Detailed installation & configuration |
| [FULLSTACK_README.md](FULLSTACK_README.md) | Complete feature documentation |
| [API.md](API.md) | REST API endpoint reference |

## 🏗️ Project Structure

```
project/
├── backend/
│   ├── server.js           # Express API server (7 endpoints)
│   └── package.json        # Node.js dependencies
├── frontend/
│   ├── src/
│   │   ├── App.js          # Main React component
│   │   ├── components/     # React components
│   │   └── styles/         # CSS styling
│   └── package.json        # React dependencies
├── src/
│   ├── inference.py        # YOLOv11 wrapper
│   ├── config.py           # Configuration loader
│   ├── utils.py            # Helper functions
│   ├── process_images.py   # Image processor
│   └── process_directory.py # Directory processor
├── configs/
│   └── default.yaml        # YOLO settings
├── data/
│   ├── raw/                # Input images
│   ├── processed/          # Metadata (generated)
│   └── uploads/            # Uploaded files (generated)
└── requirements.txt        # Python dependencies
```

## 🔌 API Endpoints

1. **GET /api/health** - Health check
2. **POST /api/process-directory** - Process images from directory
3. **POST /api/process-images** - Upload and process images
4. **POST /api/load-metadata** - Load existing metadata
5. **POST /api/search** - Search images by criteria
6. **POST /api/get-classes** - Get unique object classes
7. **GET /api/images/:filename** - Serve image files

See [API.md](API.md) for complete documentation with examples.

## ⚙️ Configuration

### Python (configs/default.yaml)
```yaml
model:
  yolo_model: "yolo11m.pt"  # Options: yolo11n, yolo11s, yolo11m, yolo11l, yolo11x
  conf_threshold: 0.3        # Confidence threshold

data:
  image_extension: [".jpg", ".jpeg", ".png"]
```

### Backend (.env)
```
PORT=5000
NODE_ENV=development
```

## 🐳 Docker Deployment

```powershell
# Build and run with Docker Compose
docker-compose up

# Frontend: http://localhost:3000
# Backend API: http://localhost:5000/api
```

## 🛠️ Development

### Backend Development
```powershell
cd backend
npm install
npm start
```

### Frontend Development
```powershell
cd frontend
npm install
npm start
```

Both servers support hot-reload during development.

## 📋 Usage Guide

### Processing Images

1. **From Directory**
   - Go to "Process Images" tab
   - Select "Directory Processing"
   - Enter directory path: `data/raw/your-folder`
   - Click "Start Inference"

2. **Upload Images**
   - Select "Upload Images" mode
   - Select image files
   - Click upload

3. **Load Existing Metadata**
   - Select "Load Metadata" mode
   - Enter metadata file path
   - Click "Load Metadata"

### Searching Images

1. Select object classes to search for
2. Choose search mode (OR = any class, AND = all classes)
3. Configure count thresholds (optional)
4. Click "Search Images"
5. View results in responsive grid
6. Download results as JSON

## 🔧 Troubleshooting

| Issue | Solution |
|-------|----------|
| npm not found | Install Node.js from https://nodejs.org |
| Port already in use | Change PORT in backend/.env |
| Python module not found | Run `pip install -r requirements.txt` |
| YOLO model not found | Run `python -c "from ultralytics import YOLO; YOLO('yolo11m.pt')"` |

See [SETUP.md](SETUP.md) for more troubleshooting.

## 🎓 Technology Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + CSS3 |
| Backend | Node.js + Express 4 |
| API | REST with JSON |
| Inference | YOLOv11 + PyTorch |
| DevOps | Docker + Docker Compose |
| Package Manager | npm + pip |

## 📊 Performance

- **Image Processing**: 2-5 seconds per image (depends on model & image size)
- **Search**: <1 second on typical dataset
- **UI Response**: Instant (non-blocking async)

## 📝 License

MIT License - Feel free to use for personal and commercial projects.

## 👤 Author

**Satyam Kumar**  
📧 Email: satyamkumarcode@gmail.com

---

**Ready to start?** → See [QUICKSTART.md](QUICKSTART.md)
pip install -r requirements.txt
```

## Usage

### 3 Simple Steps to Start

**Step 1: Install Dependencies**
```powershell
# Terminal 1 - Backend & Python packages
pip install -r requirements.txt
cd backend
npm install
cd ..

# Terminal 2 - Frontend
cd frontend
npm install
cd ..
```

**Step 2: Start Services**
```powershell
# Terminal 1 - Backend (Port 5000)
cd backend
npm start

# Terminal 2 - Frontend (Port 3000)
cd frontend
npm start

# Application opens automatically at http://localhost:3000
```

**Step 3: Process Images**
- Upload images via the **Process Images** tab
- Or load a pre-processed metadata file
- Then use the **Search** tab to find objects by class

## Project Structure
```
.
├── backend/                      # Express.js REST API
│   ├── server.js                 # Main server file
│   ├── package.json              # Node dependencies
│   └── .env.example              # Environment template
├── frontend/                     # React web app
│   ├── src/
│   │   ├── components/
│   │   │   ├── ProcessPanel.js   # Upload & process UI
│   │   │   ├── SearchPanel.js    # Search interface
│   │   │   └── ResultsGrid.js    # Results display
│   │   ├── App.js                # Main component
│   │   └── index.js              # Entry point
│   ├── public/index.html         # HTML template
│   └── package.json              # React dependencies
├── src/                          # Python backend
│   ├── inference.py              # YOLOv11 inference
│   ├── process_images.py         # Image processor
│   ├── process_directory.py      # Directory processor
│   ├── config.py                 # Configuration loader
│   └── utils.py                  # Utility functions
├── configs/
│   └── default.yaml              # Configuration file
├── data/
│   ├── raw/                      # Input images
│   ├── processed/                # Processing results
│   └── uploads/                  # Uploaded files (runtime)
├── requirements.txt              # Python dependencies
├── SETUP.md                      # Detailed setup guide
├── API.md                        # REST API documentation
└── QUICKSTART.md                 # 5-minute quick start
```

## Configuration

Edit `configs/default.yaml` to customize:
- Model selection
- Confidence threshold
- Supported image extensions

See [SETUP.md](SETUP.md#configuration) for detailed configuration options.

## API Endpoints

All endpoints are documented in [API.md](API.md). Quick reference:

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/health` | GET | Health check |
| `/api/process-images` | POST | Upload & process images |
| `/api/process-directory` | POST | Process directory of images |
| `/api/load-metadata` | POST | Load saved metadata |
| `/api/search` | POST | Search processed images |
| `/api/get-classes` | POST | Get available object classes |
| `/api/images/:filename` | GET | Serve processed images |

## Model & CUDA Setup

**YOLOv11 Model Weights**
- Weights (`yolo11m.pt`) are automatically downloaded on first run
- For manual download: https://github.com/ultralytics/assets/releases

**GPU Acceleration (Optional)**
For faster inference with NVIDIA GPU:

### Windows
```powershell
# Install CUDA Toolkit
# https://docs.nvidia.com/cuda/cuda-installation-guide-microsoft-windows/

# Install cuDNN
# https://developer.nvidia.com/cudnn

# Reinstall PyTorch with CUDA support
pip install torch torchvision --index-url https://download.pytorch.org/whl/cu118
```

### Linux/macOS
```bash
# Follow official CUDA installation guide
# https://docs.nvidia.com/cuda/cuda-installation-guide-linux/
# https://docs.nvidia.com/cuda/cuda-installation-guide-mac/
```

## Docker Deployment

**Build and run with Docker:**
```bash
# Build containers
docker-compose build

# Start services
docker-compose up

# Access at http://localhost:3000
```

See [FULLSTACK_README.md](FULLSTACK_README.md) for production deployment details.

## License
MIT
