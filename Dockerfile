FROM python:3.10-slim

# Install system dependencies (libgl1 replaces libgl1-mesa-glx in newer Debian)
RUN apt-get update && apt-get install -y \
    curl \
    libgl1 \
    libglib2.0-0 \
    libsm6 \
    libxext6 \
    libxrender-dev \
    && rm -rf /var/lib/apt/lists/*

# Install Node.js
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - \
    && apt-get install -y nodejs \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy Python requirements and install
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy Python source
COPY src/ ./src/
COPY configs/ ./configs/

# Copy YOLO model weights
COPY yolo11m.pt ./yolo11m.pt

# Copy backend
COPY backend/package.json backend/
WORKDIR /app/backend
RUN npm install --production
WORKDIR /app

# Copy backend source
COPY backend/ ./backend/

# Copy frontend build (build it before running docker build)
COPY frontend/build ./frontend/build

# Copy pre-processed COCO dataset metadata (for demo purposes)
COPY data/processed/coco-val-2017-500/metadata.json ./data/processed/coco-val-2017-500/

# Create additional data directories
RUN mkdir -p data/raw data/uploads

# Expose port
EXPOSE 5000

# Set environment
ENV NODE_ENV=production
ENV PYTHONUNBUFFERED=1
ENV PORT=5000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD curl -f http://localhost:5000/api/health || exit 1

# Start backend server (serves both API and frontend)
CMD ["node", "backend/server.js"]
