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
  const canvasRef = React.useRef(null);

  useEffect(() => {
    const imagePath = result.image_path;
    if (!imagePath) {
      setLoadError('No image path');
      return;
    }
    const encodedPath = encodeURIComponent(imagePath);
    const url = `/api/image?imagePath=${encodedPath}`;
    setImageUrl(url);
    setLoadError(null);
  }, [result.image_path]);

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
      setLoadError('Failed to load image');
    };
    
    img.src = imageUrl;
  }, [showBoxes, imageUrl, result.detections]);

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
            onError={() => setLoadError('Failed to load')}
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
  const canvasRef = React.useRef(null);

  useEffect(() => {
    const imagePath = result.image_path;
    if (imagePath) {
      setImageUrl(`/api/image?imagePath=${encodeURIComponent(imagePath)}`);
    }
  }, [result.image_path]);

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

        <div className="modal-image">
          {showBoxes ? (
            <canvas ref={canvasRef} />
          ) : (
            <img src={imageUrl} alt={fileName} />
          )}
        </div>

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
