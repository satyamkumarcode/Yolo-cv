# Yolo-cv — Search Images by What's Inside Them

[![Python](https://img.shields.io/badge/Python-3.8+-3776AB?style=flat&logo=python&logoColor=white)](https://python.org)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat&logo=react&logoColor=black)](https://reactjs.org)
[![Node.js](https://img.shields.io/badge/Node.js-16+-339933?style=flat&logo=node.js&logoColor=white)](https://nodejs.org)
[![YOLOv11](https://img.shields.io/badge/YOLOv11-Ultralytics-FF6B35?style=flat)](https://ultralytics.com)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=flat&logo=docker&logoColor=white)](https://docker.com)
[![Azure](https://img.shields.io/badge/Azure-Deployed-0078D4?style=flat&logo=microsoft-azure&logoColor=white)](https://azure.microsoft.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=flat)](LICENSE)

> **Upload images → detect objects → search by content.** Find every photo with a "car AND person" in one query — no manual tagging needed.

---

## What it does

Traditional image search relies on filenames or manual tags. This app runs **YOLOv11 object detection** on every image and indexes what's actually inside them. You can then search across thousands of images using AND/OR logic on detected object classes — results return in under 1 second.

---

## Key Features

- **Content-aware search** — query images by detected objects (e.g. `car AND traffic light`)
- **AND / OR search modes** — flexible multi-class filtering with count thresholds
- **Batch processing** — point at a directory, process entire datasets at once
- **File upload UI** — drag-and-drop images directly from the browser
- **Non-blocking pipeline** — async inference keeps UI responsive during 2-5s per-image processing
- **Exportable results** — download search results as JSON for downstream use
- **Docker + Azure ready** — one command deploy to production

---

## Tech Stack

| Layer     | Technology                            |
| --------- | ------------------------------------- |
| Frontend  | React 18 + CSS3                       |
| Backend   | Node.js + Express 4 (7 REST endpoints)|
| Inference | YOLOv11 (Ultralytics) + PyTorch       |
| Bridge    | python-shell (Node ↔ Python)          |
| DevOps    | Docker + Docker Compose + Azure       |

---

## Quick Start

```bash
# 1. Install Python dependencies
pip install -r requirements.txt

# 2. Install backend dependencies
cd backend && npm install && cd ..

# 3. Install frontend dependencies
cd frontend && npm install && cd ..

# 4. Start backend (Terminal 1)
cd backend && npm start

# 5. Start frontend (Terminal 2)
cd frontend && npm start
```

Open <http://localhost:3000>

**Docker (one command):**

```bash
docker-compose up
```

---

## Performance

| Operation           | Time           |
| ------------------- | -------------- |
| Per-image inference | 2–5 seconds    |
| Search query        | < 1 second     |
| UI response         | Instant (async)|

---

## API Endpoints

| Method | Endpoint                  | Purpose                  |
| ------ | ------------------------- | ------------------------ |
| GET    | `/api/health`             | Health check             |
| POST   | `/api/process-images`     | Upload & run inference   |
| POST   | `/api/process-directory`  | Batch process directory  |
| POST   | `/api/load-metadata`      | Load saved results       |
| POST   | `/api/search`             | Search by object class   |
| POST   | `/api/get-classes`        | List detected classes    |
| GET    | `/api/images/:filename`   | Serve image files        |

---

## Demo

> 📸 Add a GIF or screenshot here — `docs/demo.gif`

---

## Author

**Satyam Kumar** · <satyamkumarcode@gmail.com>

### Guidance

Dr. Santwana Sagnika, KIIT University
