# YOLOv11 Image Search Application

A computer vision-powered search application built with YOLOv11 for object detection and metadata management.

## Author
**Satyam Kumar**  
📧 Email: satyamkumarcode@gmail.com

## Features
- YOLOv11 object detection inference
- Streamlit-based web interface
- Image batch processing
- Metadata extraction and management
- Object search and filtering by class
- Confidence threshold configuration

## Installation

### CPU Version
```bash
conda create -n yolo_image_search python=3.11 -y
conda activate yolo_image_search
pip install -r requirements.txt
```

### GPU Version
```bash
conda create -n yolo_image_search_gpu python=3.11 -y
conda activate yolo_image_search_gpu
conda install pytorch==2.5.1 torchvision==0.20.1 pytorch-cuda=12.4 -c pytorch -c nvidia
pip install -r requirements.txt
```

## Usage

Run the Streamlit application:
```bash
streamlit run app.py
```

The app will open at `http://localhost:8501`

### Custom Port
```bash
streamlit run app.py --server.port 8080
```

## Project Structure
```
.
├── app.py                    # Streamlit application
├── requirements.txt          # Python dependencies
├── packages.txt              # System dependencies (Streamlit Cloud)
├── configs/
│   └── default.yaml         # Configuration file
├── data/
│   └── raw/
│       └── coco-val-2017-500/  # Input images
├── output/                   # Inference results
└── src/
    ├── config.py            # Config loader
    ├── inference.py         # YOLOv11 inference class
    └── utils.py             # Utility functions
```

## Configuration

Edit `configs/default.yaml` to customize:
- Model selection
- Confidence threshold
- Supported image extensions

## Notes

- **Model weights** (`yolo11m.pt`) is excluded from version control due to size
- Download from [Ultralytics](https://github.com/ultralytics/assets/releases)
- Place in project root directory

## CUDA Setup (Optional)

### Linux
- https://docs.nvidia.com/cuda/cuda-installation-guide-linux/

### Windows
- https://docs.nvidia.com/cuda/cuda-installation-guide-microsoft-windows/

### Forums
- https://forums.developer.nvidia.com/t/whats-the-relationship-between-cuda-toolkit-and-pytorch/251096/2

## License
MIT
