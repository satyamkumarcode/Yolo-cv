const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { PythonShell } = require('python-shell');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Storage configuration
const uploadsDir = path.join(__dirname, '../data/uploads');
const processedDir = path.join(__dirname, '../data/processed');

[uploadsDir, processedDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${uuidv4()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

// Create a wrapper to capture Python stderr
function runPythonWithLogging(scriptName, pythonOptions, callback) {
  const pyshell = new PythonShell(scriptName, pythonOptions);
  
  let output = '';
  let errorOutput = '';
  let messageCount = 0;

  pyshell.on('message', message => {
    messageCount++;
    console.log(`📦 Python Message ${messageCount}: ${message}`);
    output += message + '\n';
  });

  pyshell.on('stderr', stderr => {
    console.log(`⚠️  Python Stderr: ${stderr}`);
    errorOutput += stderr + '\n';
  });

  pyshell.on('close', (code) => {
    console.log(`🟢 Python Process Closed (code ${code}), Messages: ${messageCount}`);
  });

  pyshell.end((err, code, signal) => {
    console.log(`🟢 Python Script Finished (code ${code}), Total output: ${output.length} chars`);
    if (err) {
      console.error(`🔴 Python Error (code ${code}):`, err);
      callback(err, null);
    } else {
      const results = [output.trim()];
      console.log(`📋 Results to parse: ${results[0].substring(0, 200)}`);
      callback(null, results);
    }
  });
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'Backend is running' });
});

// Get available datasets endpoint
app.get('/api/datasets', (req, res) => {
  try {
    const datasets = [];
    
    if (fs.existsSync(processedDir)) {
      const directories = fs.readdirSync(processedDir, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);
      
      for (const dir of directories) {
        const metadataPath = path.join(processedDir, dir, 'metadata.json');
        if (fs.existsSync(metadataPath)) {
          try {
            const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
            datasets.push({
              name: dir,
              metadataPath: `data/processed/${dir}/metadata.json`,
              imageCount: Array.isArray(metadata) ? metadata.length : 0,
              createdAt: fs.statSync(metadataPath).mtime
            });
          } catch (parseErr) {
            console.warn(`Could not parse metadata for ${dir}`);
          }
        }
      }
    }
    
    // Sort by creation date (newest first)
    datasets.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    res.json({ success: true, datasets });
  } catch (error) {
    console.error('Error fetching datasets:', error);
    res.status(500).json({ error: 'Error fetching datasets', details: error.message });
  }
});

// Process images endpoint
app.post('/api/process-images', upload.array('files'), async (req, res) => {
  try {
    const { modelPath = 'yolo11m.pt', batchId = uuidv4() } = req.body;
    
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    const filePaths = req.files.map(file => file.path);
    const batchDir = path.join(processedDir, batchId);
    
    if (!fs.existsSync(batchDir)) {
      fs.mkdirSync(batchDir, { recursive: true });
    }

    // Call Python inference script
    const pythonOptions = {
      pythonPath: process.env.PYTHON_PATH || 'python',
      scriptPath: path.join(__dirname, '../src'),
      args: [JSON.stringify({ files: filePaths, modelPath, batchId })],
      cwd: path.join(__dirname, '..')
    };

    PythonShell.run('process_images.py', pythonOptions, (err, results) => {
      if (err) {
        console.error('Python error:', err);
        return res.status(500).json({ error: 'Error processing images', details: err.message });
      }

      try {
        const metadata = JSON.parse(results[0]);
        res.json({ 
          success: true, 
          batchId,
          metadata,
          fileCount: metadata.length
        });
      } catch (parseErr) {
        res.status(500).json({ error: 'Error parsing results', details: parseErr.message });
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error', details: error.message });
  }
});

// Process directory endpoint
app.post('/api/process-directory', express.json(), async (req, res) => {
  try {
    const { imageDir, modelPath = 'yolo11m.pt', maxImages = null } = req.body;

    if (!imageDir) {
      return res.status(400).json({ error: 'Image directory path required' });
    }

    console.log('\n========== STARTING IMAGE PROCESSING ==========');
    console.log(`Image Directory: ${imageDir}`);
    console.log(`Model Path: ${modelPath}`);
    console.log(`Max Images: ${maxImages || 'unlimited'}`);
    console.log('=============================================\n');

    const pythonOptions = {
      pythonPath: process.env.PYTHON_PATH || 'python',
      scriptPath: path.join(__dirname, '../src'),
      args: [JSON.stringify({ imageDir, modelPath, maxImages })],
      cwd: path.join(__dirname, '..'),
      encoding: 'utf8'
    };

    console.log(`Python Path: ${pythonOptions.pythonPath}`);
    console.log(`Script Path: ${pythonOptions.scriptPath}`);
    console.log(`Working Directory: ${pythonOptions.cwd}\n`);

    runPythonWithLogging('process_directory.py', pythonOptions, (err, results) => {
      if (err) {
        console.error('\n❌ PYTHON ERROR:');
        console.error(err);
        console.error('=============================================\n');
        return res.status(500).json({ error: 'Error processing directory', details: err.message });
      }

      console.log('\n✅ PROCESSING COMPLETED');
      console.log('Results received from Python');

      try {
        const metadata = JSON.parse(results[0]);
        const batchId = uuidv4();
        const batchDir = path.join(processedDir, batchId);
        
        if (!fs.existsSync(batchDir)) {
          fs.mkdirSync(batchDir, { recursive: true });
        }

        // Save metadata
        fs.writeFileSync(
          path.join(batchDir, 'metadata.json'),
          JSON.stringify(metadata, null, 2)
        );

        console.log(`Total images processed: ${metadata.length}`);
        console.log(`Batch ID: ${batchId}`);
        console.log('=============================================\n');

        res.json({
          success: true,
          batchId,
          metadata,
          fileCount: metadata.length
        });
      } catch (parseErr) {
        res.status(500).json({ error: 'Error parsing results', details: parseErr.message });
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error', details: error.message });
  }
});

// Test endpoint - process just 10 images for quick testing
app.post('/api/test-process', express.json(), async (req, res) => {
  const { imageDir = 'data/raw/coco-val-2017-500', modelPath = 'yolo11m.pt' } = req.body;

  console.log('\n========== TEST: PROCESSING 10 IMAGES ==========');
  
  const pythonOptions = {
    pythonPath: process.env.PYTHON_PATH || 'python',
    scriptPath: path.join(__dirname, '../src'),
    args: [JSON.stringify({ imageDir, modelPath, maxImages: 10 })],
    cwd: path.join(__dirname, '..'),
    encoding: 'utf8'
  };

  runPythonWithLogging('process_directory.py', pythonOptions, (err, results) => {
    if (err) {
      console.error('TEST FAILED:', err);
      return res.status(500).json({ error: 'Test failed', details: err.message });
    }

    try {
      const metadata = JSON.parse(results[0]);
      console.log(`✅ TEST PASSED: Processed ${metadata.length} images`);
      res.json({ success: true, metadata, fileCount: metadata.length });
    } catch (parseErr) {
      res.status(500).json({ error: 'Parse error', details: parseErr.message });
    }
  });
});

// Load metadata endpoint
app.post('/api/load-metadata', express.json(), (req, res) => {
  try {
    const { metadataPath } = req.body;

    if (!metadataPath) {
      return res.status(400).json({ error: 'Metadata path required' });
    }

    // Resolve path relative to project root (one level up from backend)
    const projectRoot = path.join(__dirname, '..');
    const fullPath = path.isAbsolute(metadataPath) 
      ? metadataPath 
      : path.join(projectRoot, metadataPath);
    
    console.log(`Loading metadata from: ${fullPath}`);
    
    if (!fs.existsSync(fullPath)) {
      console.error(`Metadata file not found: ${fullPath}`);
      return res.status(404).json({ error: 'Metadata file not found', path: fullPath });
    }

    const metadata = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
    
    console.log(`Successfully loaded ${metadata.length} items from metadata`);
    
    res.json({
      success: true,
      metadata,
      fileCount: metadata.length
    });
  } catch (error) {
    console.error('Load metadata error:', error);
    res.status(500).json({ error: 'Error loading metadata', details: error.message });
  }
});

// Search endpoint
app.post('/api/search', express.json(), (req, res) => {
  try {
    const { metadata, searchParams } = req.body;

    console.log('\n🔍 SEARCH REQUEST RECEIVED');
    console.log(`Total metadata items: ${Array.isArray(metadata) ? metadata.length : 'INVALID'}`);
    console.log(`Search params:`, searchParams);

    if (!metadata || !Array.isArray(metadata)) {
      console.error('❌ Invalid metadata');
      return res.status(400).json({ error: 'Valid metadata array required' });
    }

    if (metadata.length === 0) {
      console.error('❌ Empty metadata array');
      return res.status(400).json({ error: 'Metadata array is empty' });
    }

    const { 
      selectedClasses = [], 
      searchMode = 'OR',
      thresholds = {}
    } = searchParams;

    console.log(`Selected classes: ${selectedClasses.join(', ')}`);
    console.log(`Search mode: ${searchMode}`);
    console.log(`Thresholds:`, thresholds);

    if (selectedClasses.length === 0) {
      console.warn('⚠️ No classes selected');
      return res.json({ success: true, results: [], count: 0 });
    }

    let results = [];
    
    try {
      results = metadata.filter((item, idx) => {
        if (!item.detections || !Array.isArray(item.detections)) {
          console.warn(`⚠️ Item ${idx} has invalid detections`);
          return false;
        }

        const classMatches = {};

        for (const cls of selectedClasses) {
          const classDetections = item.detections.filter(d => d && d.class === cls);
          const classCount = classDetections.length;
          
          const threshold = thresholds[cls];
          if (threshold && threshold !== 'None') {
            const thresholdNum = parseInt(threshold);
            classMatches[cls] = classCount >= 1 && classCount <= thresholdNum;
          } else {
            classMatches[cls] = classCount >= 1;
          }
        }

        if (searchMode === 'OR') {
          return Object.values(classMatches).some(match => match);
        } else {
          return Object.values(classMatches).every(match => match);
        }
      });

      console.log(`✅ Search completed: ${results.length} matches found`);
      
      // Log first result structure for debugging
      if (results.length > 0) {
        console.log('📄 First result structure:', JSON.stringify(results[0], null, 2));
      }
    } catch (filterError) {
      console.error('❌ Filter error:', filterError);
      return res.status(500).json({ error: 'Error filtering results', details: filterError.message });
    }

    res.json({
      success: true,
      results,
      count: results.length
    });
  } catch (error) {
    console.error('❌ SEARCH ERROR:', error);
    res.status(500).json({ error: 'Search error', details: error.message });
  }
});

// Get unique classes endpoint
app.post('/api/get-classes', express.json(), (req, res) => {
  try {
    const { metadata } = req.body;

    console.log('\n📋 GET-CLASSES REQUEST');
    console.log(`Metadata items: ${Array.isArray(metadata) ? metadata.length : 'INVALID'}`);

    if (!metadata || !Array.isArray(metadata)) {
      console.error('❌ Invalid metadata for classes');
      return res.status(400).json({ error: 'Valid metadata array required' });
    }

    if (metadata.length === 0) {
      console.error('❌ Empty metadata');
      return res.status(400).json({ error: 'Metadata array is empty' });
    }

    const uniqueClasses = new Set();
    const countOptions = {};

    try {
      metadata.forEach((item, idx) => {
        if (!item.detections || !Array.isArray(item.detections)) {
          console.warn(`⚠️ Item ${idx} has no detections`);
          return;
        }
        
        item.detections.forEach(det => {
          if (det && det.class) {
            uniqueClasses.add(det.class);
            if (!countOptions[det.class]) {
              countOptions[det.class] = new Set();
            }
            countOptions[det.class].add(det.count);
          }
        });
      });
    } catch (parseError) {
      console.error('❌ Error parsing metadata:', parseError);
      return res.status(500).json({ error: 'Error parsing metadata', details: parseError.message });
    }

    const sortedClasses = Array.from(uniqueClasses).sort();
    const sortedCounts = {};
    
    sortedClasses.forEach(cls => {
      sortedCounts[cls] = Array.from(countOptions[cls]).sort((a, b) => a - b);
    });

    console.log(`✅ Found ${sortedClasses.length} classes`);

    res.json({
      success: true,
      classes: sortedClasses,
      countOptions: sortedCounts
    });
  } catch (error) {
    console.error('❌ GET-CLASSES ERROR:', error);
    res.status(500).json({ error: 'Error processing classes', details: error.message });
  }
});

// Serve images endpoint
app.get('/api/images/:filename', (req, res) => {
  try {
    const filename = req.params.filename;
    const filepath = path.join(uploadsDir, filename);

    if (!fs.existsSync(filepath)) {
      return res.status(404).json({ error: 'Image not found' });
    }

    res.sendFile(filepath);
  } catch (error) {
    res.status(500).json({ error: 'Error serving image', details: error.message });
  }
});

// Serve images from any path (GET with query parameter)
app.get('/api/image', (req, res) => {
  try {
    let imagePath = req.query.imagePath;
    if (!imagePath) {
      return res.status(400).json({ error: 'Image path required' });
    }

    imagePath = decodeURIComponent(imagePath);
    console.log(`[IMAGE] GET Requested path: ${imagePath}`);
    
    // Convert Windows backslashes to forward slashes for cross-platform compatibility
    imagePath = imagePath.replace(/\\/g, '/');
    
    // Normalize path
    imagePath = path.normalize(imagePath);
    
    // If it's a relative path, resolve it relative to project root
    if (!path.isAbsolute(imagePath)) {
      const projectRoot = path.join(__dirname, '..');
      imagePath = path.join(projectRoot, imagePath);
      console.log(`[IMAGE] GET Resolved to absolute: ${imagePath}`);
    }
    
    // Verify file exists
    if (!fs.existsSync(imagePath)) {
      console.error(`[IMAGE] GET File not found: ${imagePath}`);
      return res.status(404).json({ error: 'File not found', path: imagePath });
    }

    console.log(`[IMAGE] GET Serving file: ${imagePath}`);
    
    const ext = path.extname(imagePath).toLowerCase();
    const contentTypeMap = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.webp': 'image/webp'
    };

    // Set CORS headers for canvas operations
    res.setHeader('Content-Type', contentTypeMap[ext] || 'image/jpeg');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    
    res.sendFile(imagePath);
  } catch (error) {
    console.error('[IMAGE] GET Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Serve images from any path (POST with body)
app.post('/api/image', express.json(), (req, res) => {
  try {
    let { imagePath } = req.body;

    if (!imagePath) {
      return res.status(400).json({ error: 'Image path required' });
    }

    console.log(`[IMAGE] POST Requested path: ${imagePath}`);

    // If it's an absolute path, use it directly
    let fullPath = imagePath;
    
    if (!path.isAbsolute(fullPath)) {
      // Relative path - treat as relative to project root
      const projectRoot = path.join(__dirname, '..');
      fullPath = path.join(projectRoot, imagePath);
    }

    // Normalize the final path
    fullPath = path.normalize(fullPath);
    
    console.log(`[IMAGE] POST Full resolved path: ${fullPath}`);

    if (!fs.existsSync(fullPath)) {
      console.error(`[IMAGE] POST File not found: ${fullPath}`);
      // Try with the original path as-is in case it's an absolute Windows path
      if (fs.existsSync(imagePath)) {
        fullPath = imagePath;
        console.log(`[IMAGE] POST Found using original path: ${fullPath}`);
      } else {
        return res.status(404).json({ error: 'Image file not found', path: fullPath });
      }
    }

    console.log(`[IMAGE] POST Serving file: ${fullPath}`);

    // Set appropriate content type based on file extension
    const ext = path.extname(fullPath).toLowerCase();
    const contentTypeMap = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.webp': 'image/webp'
    };
    
    const contentType = contentTypeMap[ext] || 'image/jpeg';
    res.setHeader('Content-Type', contentType);
    res.sendFile(fullPath);
  } catch (error) {
    console.error('[IMAGE] POST Error serving image:', error);
    res.status(500).json({ error: 'Error serving image', details: error.message });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error', details: err.message });
});

// Single image upload and detection endpoint
app.post('/api/detect-single', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image uploaded' });
    }

    const { modelPath = 'yolo11m.pt' } = req.body;
    const imagePath = req.file.path;
    const originalName = req.file.originalname;

    console.log('\n========== SINGLE IMAGE DETECTION ==========');
    console.log(`Image: ${originalName}`);
    console.log(`Saved Path: ${imagePath}`);
    console.log(`Model: ${modelPath}`);
    console.log('=============================================\n');

    const pythonOptions = {
      pythonPath: process.env.PYTHON_PATH || 'python',
      scriptPath: path.join(__dirname, '../src'),
      args: [JSON.stringify({ imagePath, modelPath })],
      cwd: path.join(__dirname, '..'),
      encoding: 'utf8'
    };

    runPythonWithLogging('detect_single.py', pythonOptions, (err, results) => {
      if (err) {
        console.error('\n❌ DETECTION ERROR:', err);
        return res.status(500).json({ error: 'Error detecting objects', details: err.message });
      }

        try {
          // Robustly parse last non-empty line from Python output
          let outputLines = (results[0] || '').split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 0);
          let lastLine = outputLines.length > 0 ? outputLines[outputLines.length - 1] : '';
          const detection = JSON.parse(lastLine);
          // Normalize the path for serving
          const normalizedPath = imagePath.replace(/\\/g, '/');
          res.json({
            success: true,
            image: {
              originalName,
              path: normalizedPath,
              url: `/api/image?path=${encodeURIComponent(normalizedPath)}`
            },
            detection
          });
        } catch (parseErr) {
          console.error('Parse error:', parseErr);
          res.status(500).json({ error: 'Error parsing detection results', details: parseErr.message });
        }
    });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Server error', details: error.message });
  }
});

// Serve static frontend files in production
if (process.env.NODE_ENV === 'production') {
  const frontendBuildPath = path.join(__dirname, '../frontend/build');
  
  // Serve static files from React build
  app.use(express.static(frontendBuildPath));
  
  // Handle React routing - serve index.html for all non-API routes
  app.get('*', (req, res) => {
    // Don't serve index.html for API routes
    if (req.path.startsWith('/api/')) {
      return res.status(404).json({ error: 'API endpoint not found' });
    }
    res.sendFile(path.join(frontendBuildPath, 'index.html'));
  });
  
  console.log('Serving frontend from:', frontendBuildPath);
}

// Start server
const server = app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} already in use!`);
  } else {
    console.error('Server error:', err);
  }
  process.exit(1);
});
