import React, { useState, useEffect } from 'react';
import '../styles/ResultsGrid.css';
import { FiGrid, FiList, FiDownload, FiMaximize2, FiX, FiEye, FiEyeOff, FiImage, FiBox } from 'react-icons/fi';

function ResultsGrid({ results, metadata }) {
  const [gridColumns, setGridColumns] = useState(3);
  const [showBoxes, setShowBoxes] = useState(true);
  const [highlightMatches, setHighlightMatches] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [selectedImage, setSelectedImage] = useState(null);

  const handleDownload = () => {
    const dataStr = JSON.stringify(results, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'search_results.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="results-section">
      {/* Results Header */}
      <div className="results-header">
        <div className="results-title">
          <div className="results-icon">
            <FiImage />
          </div>
          <div className="results-text">
            <h2>Search Results</h2>
            <p><strong>{results.length}</strong> images found</p>
          </div>
        </div>

        <div className="results-controls">
          {/* View Mode */}
          <div className="control-group view-mode">
            <button 
              className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
              title="Grid View"
            >
              <FiGrid />
            </button>
            <button 
              className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
              title="List View"
            >
              <FiList />
            </button>
          </div>

          {/* Column Slider */}
          {viewMode === 'grid' && (
            <div className="control-group columns-control">
              <label>Columns</label>
              <div className="slider-wrapper">
                <input
                  type="range"
                  min="2"
                  max="5"
                  value={gridColumns}
                  onChange={(e) => setGridColumns(parseInt(e.target.value))}
                />
                <span className="slider-value">{gridColumns}</span>
              </div>
            </div>
          )}

          {/* Toggle Controls */}
          <div className="control-group toggle-controls">
            <button 
              className={`toggle-btn ${showBoxes ? 'active' : ''}`}
              onClick={() => setShowBoxes(!showBoxes)}
            >
              <FiBox />
              <span>Boxes</span>
            </button>
            <button 
              className={`toggle-btn ${highlightMatches ? 'active' : ''}`}
              onClick={() => setHighlightMatches(!highlightMatches)}
            >
              {highlightMatches ? <FiEye /> : <FiEyeOff />}
              <span>Highlight</span>
            </button>
          </div>

          {/* Export Button */}
          <button className="export-btn" onClick={handleDownload}>
            <FiDownload />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Results Grid */}
      <div 
        className={`results-grid ${viewMode}`}
        style={viewMode === 'grid' ? { gridTemplateColumns: `repeat(${gridColumns}, 1fr)` } : {}}
      >
        {results.map((result, idx) => (
          <ImageCard
            key={idx}
            result={result}
            showBoxes={showBoxes}
            highlightMatches={highlightMatches}
            viewMode={viewMode}
            onExpand={() => setSelectedImage(result)}
          />
        ))}
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <ImageModal
          result={selectedImage}
          showBoxes={showBoxes}
          onClose={() => setSelectedImage(null)}
        />
      )}
    </div>
  );
}

function ImageCard({ result, showBoxes, highlightMatches, viewMode, onExpand }) {
  const [loadError, setLoadError] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [useFallback, setUseFallback] = useState(false);
  const canvasRef = React.useRef(null);

  // Get COCO image URL from filename
  const getCocoImageUrl = (imagePath) => {
    const fileName = imagePath.split('\\').pop() || imagePath.split('/').pop();
    // COCO 2017 validation images are publicly available
    return `http://images.cocodataset.org/val2017/${fileName}`;
  };

  useEffect(() => {
    const imagePath = result.image_path;
    if (!imagePath) {
      setLoadError('No image path');
      return;
    }
    
    if (useFallback) {
      // Use COCO CDN as fallback
      setImageUrl(getCocoImageUrl(imagePath));
    } else {
      // Try local server first
      const encodedPath = encodeURIComponent(imagePath);
      setImageUrl(`/api/image?imagePath=${encodedPath}`);
    }
    setLoadError(null);
  }, [result.image_path, useFallback]);

  // Handle image load error - switch to COCO CDN fallback
  const handleImageError = () => {
    if (!useFallback) {
      console.log('Local image failed, trying COCO CDN fallback...');
      setUseFallback(true);
    } else {
      setLoadError('Failed to load image');
    }
  };

  useEffect(() => {
    if (!showBoxes || !imageUrl || !canvasRef.current) {
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      result.detections.forEach((det) => {
        const [x1, y1, x2, y2] = det.bbox;
        const color = '#6366f1';

        ctx.strokeStyle = color;
        ctx.lineWidth = 3;
        ctx.strokeRect(x1, y1, x2 - x1, y2 - y1);

        const label = `${det.class} ${det.confidence.toFixed(2)}`;
        ctx.fillStyle = color;
        ctx.font = 'bold 14px Inter, sans-serif';
        const textMetrics = ctx.measureText(label);
        const padding = 6;
        ctx.fillRect(x1, y1 - 24, textMetrics.width + padding * 2, 24);

        ctx.fillStyle = 'white';
        ctx.fillText(label, x1 + padding, y1 - 7);
      });
    };
    
    img.onerror = () => {
      handleImageError();
    };
    
    img.src = imageUrl;
  }, [showBoxes, imageUrl, result.detections, useFallback]);

  const fileName = result.image_path.split('\\').pop() || result.image_path.split('/').pop();
  const objectList = Object.entries(result.class_counts);

  return (
    <div className={`image-card ${viewMode}`}>
      <div className="card-image">
        {loadError ? (
          <div className="error-placeholder">
            <FiImage />
            <span>{loadError}</span>
          </div>
        ) : showBoxes && imageUrl ? (
          <canvas ref={canvasRef} />
        ) : imageUrl ? (
          <img
            src={imageUrl}
            alt={fileName}
            onError={handleImageError}
          />
        ) : (
          <div className="loading-placeholder">
            <span className="loader"></span>
          </div>
        )}

        {/* Overlay Actions */}
        <div className="card-overlay">
          <button className="expand-btn" onClick={onExpand}>
            <FiMaximize2 />
          </button>
        </div>

        {/* Object Count Badge */}
        <div className="object-badge">
          <FiBox />
          <span>{result.detections.length}</span>
        </div>
      </div>

      <div className="card-content">
        <h4 className="card-title">{fileName}</h4>
        <div className="card-objects">
          {objectList.slice(0, 4).map(([cls, count]) => (
            <span key={cls} className={`object-tag ${highlightMatches ? 'highlight' : ''}`}>
              {cls}: {count}
            </span>
          ))}
          {objectList.length > 4 && (
            <span className="object-tag more">+{objectList.length - 4}</span>
          )}
        </div>
      </div>
    </div>
  );
}

function ImageModal({ result, showBoxes, onClose }) {
  const [imageUrl, setImageUrl] = useState('');
  const [useFallback, setUseFallback] = useState(false);
  const canvasRef = React.useRef(null);
  const containerRef = React.useRef(null);
  
  // Pan and zoom state
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Get COCO image URL from filename
  const getCocoImageUrl = (imagePath) => {
    const fileName = imagePath.split('\\').pop() || imagePath.split('/').pop();
    return `http://images.cocodataset.org/val2017/${fileName}`;
  };

  useEffect(() => {
    const imagePath = result.image_path;
    if (imagePath) {
      if (useFallback) {
        setImageUrl(getCocoImageUrl(imagePath));
      } else {
        setImageUrl(`/api/image?imagePath=${encodeURIComponent(imagePath)}`);
      }
    }
  }, [result.image_path, useFallback]);

  // Handle image load error
  const handleImageError = () => {
    if (!useFallback) {
      setUseFallback(true);
    }
  };

  // Zoom controls
  const handleZoomIn = () => setScale(prev => Math.min(prev + 0.25, 4));
  const handleZoomOut = () => setScale(prev => Math.max(prev - 0.25, 0.5));
  const handleResetZoom = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  // Mouse wheel zoom
  const handleWheel = (e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setScale(prev => Math.max(0.5, Math.min(4, prev + delta)));
  };

  // Drag to pan
  const handleMouseDown = (e) => {
    if (scale > 1) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => setIsDragging(false);
  const handleMouseLeave = () => setIsDragging(false);

  // Touch support for mobile
  const handleTouchStart = (e) => {
    if (scale > 1 && e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({ 
        x: e.touches[0].clientX - position.x, 
        y: e.touches[0].clientY - position.y 
      });
    }
  };

  const handleTouchMove = (e) => {
    if (isDragging && e.touches.length === 1) {
      setPosition({
        x: e.touches[0].clientX - dragStart.x,
        y: e.touches[0].clientY - dragStart.y
      });
    }
  };

  const handleTouchEnd = () => setIsDragging(false);

  useEffect(() => {
    if (!showBoxes || !imageUrl || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      result.detections.forEach((det) => {
        const [x1, y1, x2, y2] = det.bbox;
        const color = '#6366f1';

        ctx.strokeStyle = color;
        ctx.lineWidth = 4;
        ctx.strokeRect(x1, y1, x2 - x1, y2 - y1);

        const label = `${det.class} ${(det.confidence * 100).toFixed(0)}%`;
        ctx.fillStyle = color;
        ctx.font = 'bold 16px Inter, sans-serif';
        const textMetrics = ctx.measureText(label);
        ctx.fillRect(x1, y1 - 28, textMetrics.width + 12, 28);
        ctx.fillStyle = 'white';
        ctx.fillText(label, x1 + 6, y1 - 8);
      });
    };
    
    img.src = imageUrl;
  }, [showBoxes, imageUrl, result.detections]);

  const fileName = result.image_path.split('\\').pop() || result.image_path.split('/').pop();

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          <FiX />
        </button>

        {/* Zoom Controls */}
        <div className="modal-zoom-controls">
          <button onClick={handleZoomOut} title="Zoom Out" disabled={scale <= 0.5}>−</button>
          <span className="zoom-level">{Math.round(scale * 100)}%</span>
          <button onClick={handleZoomIn} title="Zoom In" disabled={scale >= 4}>+</button>
          <button onClick={handleResetZoom} title="Reset" className="reset-btn">Reset</button>
        </div>

        <div 
          className="modal-image"
          ref={containerRef}
          onWheel={handleWheel}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          style={{ cursor: scale > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default' }}
        >
          <div 
            className="modal-image-wrapper"
            style={{
              transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
              transition: isDragging ? 'none' : 'transform 0.1s ease-out'
            }}
          >
            {showBoxes ? (
              <canvas ref={canvasRef} />
            ) : (
              <img src={imageUrl} alt={fileName} onError={handleImageError} />
            )}
          </div>
        </div>

        <p className="modal-hint">
          {scale > 1 ? 'Drag to pan • Scroll to zoom' : 'Scroll or use buttons to zoom'}
        </p>

        <div className="modal-info">
          <h3>{fileName}</h3>
          <div className="modal-stats">
            <div className="modal-stat">
              <span className="stat-value">{result.detections.length}</span>
              <span className="stat-label">Objects</span>
            </div>
            <div className="modal-stat">
              <span className="stat-value">{Object.keys(result.class_counts).length}</span>
              <span className="stat-label">Classes</span>
            </div>
          </div>
          <div className="modal-objects">
            {Object.entries(result.class_counts).map(([cls, count]) => (
              <span key={cls} className="modal-object-tag">
                <strong>{cls}</strong>
                <span>{count}</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResultsGrid;
