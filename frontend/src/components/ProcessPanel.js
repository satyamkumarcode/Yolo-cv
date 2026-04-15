import React, { useState, useRef } from 'react';
import axios from 'axios';
import '../styles/ProcessPanel.css';
import { FiCpu, FiDatabase, FiZap, FiLayers, FiCheck, FiX, FiFolder, FiLoader, FiDollarSign, FiLock, FiGlobe, FiServer, FiWifiOff, FiShield, FiTrendingUp, FiPlay, FiUploadCloud, FiTarget, FiAward, FiCode, FiPackage, FiGrid, FiSearch, FiImage, FiBox, FiGitBranch, FiTerminal, FiUpload, FiCamera } from 'react-icons/fi';

function ProcessPanel() {
  // ...existing hooks and logic...
  // (Assume the rest of the component logic is present)
  return (
    <div>
      <div className="problem-key-benefits">
        <h3 style={{display:'flex',alignItems:'center',gap:'0.5em'}}>
          <span style={{fontWeight:'bold',fontSize:'1.2em'}}>Key Benefits</span>
        </h3>
        <p>Transform how you interact with image collections. Find exactly what you need by searching for object types within your images.</p>
        <ul className="problem-points">
          <li>Instant local processing</li>
          <li>Works completely offline</li>
          <li>No recurring costs or subscriptions</li>
        </ul>
      </div>

      {/* Key Features Section */}
      <section className="features-section" id="features-section">
        <div className="section-header">
          <span className="section-badge features-badge">Capabilities</span>
          <h2>Key Features</h2>
          <p>Discover what makes this image search system powerful and unique</p>
        </div>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon-wrapper detection">
              <span className="feature-icon industry-icon" aria-label="Object Detection" title="Object Detection">OD</span>
            </div>
            <h4>Object Detection</h4>
            <p>YOLOv11 detects 80 object classes from the COCO dataset with bounding boxes and confidence scores.</p>
            <div className="feature-tag">Core Feature</div>
          </div>

          <div className="feature-card">
            <div className="feature-icon-wrapper search">
              <span className="feature-icon industry-icon" aria-label="Semantic Search" title="Semantic Search">SS</span>
            </div>
            <h4>Semantic Image Search</h4>
            <p>Query your image library by object type. Find all images containing "dogs", "cars", or "laptops" instantly.</p>
            <div className="feature-tag">Core Feature</div>
          </div>

          <div className="feature-card">
            <div className="feature-icon-wrapper privacy">
              <span className="feature-icon industry-icon" aria-label="Privacy" title="Privacy">PR</span>
            </div>
            <h4>100% Privacy Focused</h4>
            <p>All processing happens locally on your machine. Your images never leave your computer — zero cloud uploads.</p>
            <div className="feature-tag">Privacy</div>
          </div>

          <div className="feature-card">
            <div className="feature-icon-wrapper offline">
              <span className="feature-icon industry-icon" aria-label="Offline" title="Offline">OFF</span>
            </div>
            <h4>Offline Capability</h4>
            <p>No internet required after initial setup. Process and search images anytime, anywhere, without connectivity.</p>
            <div className="feature-tag">Flexibility</div>
          </div>

          <div className="feature-card">
            <div className="feature-icon-wrapper batch">
              <span className="feature-icon industry-icon" aria-label="Batch Processing" title="Batch Processing">BP</span>
            </div>
            <h4>Batch Processing</h4>
            <p>Process entire directories of images at once. Handle thousands of images with automatic metadata generation.</p>
            <div className="feature-tag">Scalability</div>
          </div>

          <div className="feature-card">
            <div className="feature-icon-wrapper api">
              <span className="feature-icon industry-icon" aria-label="API" title="API">API</span>
            </div>
            <h4>REST API Interface</h4>
            <p>Clean API endpoints for processing and search. Easily integrate with existing workflows or build custom frontends.</p>
            <div className="feature-tag">Developer</div>
          </div>

          <div className="feature-card">
            <div className="feature-icon-wrapper metadata">
              <span className="feature-icon industry-icon" aria-label="Metadata" title="Metadata">MD</span>
            </div>
            <h4>Persistent Metadata</h4>
            <p>Detection results stored as JSON. Reload previous datasets without re-processing — efficient and fast.</p>
            <div className="feature-tag">Performance</div>
          </div>

          <div className="feature-card">
            <div className="feature-icon-wrapper ui">
              <span className="feature-icon industry-icon" aria-label="UI" title="UI">UI</span>
            </div>
            <h4>Modern Web Interface</h4>
            <p>Beautiful, responsive React frontend with real-time search, image previews, and bounding box visualization.</p>
            <div className="feature-tag">UX</div>
          </div>
        </div>
      </section>

      {/* Model Performance & Benchmarks Section */}
      <section className="benchmarks-section" id="benchmarks-section">
        <div className="section-header">
          <span className="section-badge benchmarks-badge">📊 Performance</span>
          <h2>Model Performance & Benchmarks</h2>
          <p>YOLOv11m accuracy metrics and speed comparisons from official Ultralytics benchmarks</p>
        </div>

        <div className="benchmarks-content">
          {/* Model Comparison Table */}
          <div className="model-comparison">
            <h3 className="benchmark-subtitle">🏆 YOLO Version Comparison</h3>
            <div className="benchmark-table-wrapper">
              <table className="benchmark-table">
                <thead>
                  <tr>
                    <th>Model</th>
                    <th>mAP@50</th>
                    <th>mAP@50-95</th>
                    <th>Speed (ms)</th>
                    <th>Params (M)</th>
                    <th>Size</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><span className="model-name">YOLOv8m</span></td>
                    <td>67.2%</td>
                    <td>50.2%</td>
                    <td>79.1</td>
                    <td>25.9</td>
                    <td>52MB</td>
                  </tr>
                  <tr>
                    <td><span className="model-name">YOLOv9m</span></td>
                    <td>68.1%</td>
                    <td>51.4%</td>
                    <td>76.3</td>
                    <td>20.1</td>
                    <td>40MB</td>
                  </tr>
                  <tr>
                    <td><span className="model-name">YOLOv10m</span></td>
                    <td>68.5%</td>
                    <td>51.9%</td>
                    <td>59.1</td>
                    <td>16.5</td>
                    <td>33MB</td>
                  </tr>
                  <tr className="highlighted-row">
                    <td><span className="model-name current">YOLOv11m ★</span></td>
                    <td><strong>68.9%</strong></td>
                    <td><strong>52.4%</strong></td>
                    <td><strong>25.3</strong></td>
                    <td>20.1</td>
                    <td>39MB</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="benchmark-note">* Benchmarks on COCO val2017, 640px input, NVIDIA T4 GPU. YOLOv11m offers the best speed-accuracy balance.</p>
          </div>

          {/* Key Metrics Cards */}
          <div className="metrics-grid">
            <div className="metric-card accuracy">
              <div className="metric-icon">🎯</div>
              <div className="metric-value">68.9%</div>
              <div className="metric-label">mAP@50</div>
              <div className="metric-desc">Mean Average Precision</div>
            </div>
            <div className="metric-card speed">
              <div className="metric-icon">⚡</div>
              <div className="metric-value">~25-500ms</div>
              <div className="metric-label">Inference Time</div>
              <div className="metric-desc">GPU: ~25ms | CPU: ~200-500ms</div>
            </div>
            <div className="metric-card classes">
              <div className="metric-icon">📦</div>
              <div className="metric-value">80</div>
              <div className="metric-label">Object Classes</div>
              <div className="metric-desc">COCO dataset trained</div>
            </div>
            <div className="metric-card confidence">
              <div className="metric-icon">✓</div>
              <div className="metric-value">0.3</div>
              <div className="metric-label">Conf Threshold</div>
              <div className="metric-desc">Minimum detection score</div>
            </div>
          </div>

          {/* COCO Classes Grid */}
          <div className="coco-classes">
            <h3 className="benchmark-subtitle">🏷️ 80 Detectable Object Classes (COCO Dataset)</h3>
            <div className="classes-categories">
              <div className="class-category">
                <h4>🚗 Vehicles</h4>
                <div className="class-tags">
                  <span className="class-tag">car</span>
                  <span className="class-tag">truck</span>
                  <span className="class-tag">bus</span>
                  <span className="class-tag">motorcycle</span>
                  <span className="class-tag">bicycle</span>
                  <span className="class-tag">airplane</span>
                  <span className="class-tag">train</span>
                  <span className="class-tag">boat</span>
                </div>
              </div>
              <div className="class-category">
                <h4>🐾 Animals</h4>
                <div className="class-tags">
                  <span className="class-tag">dog</span>
                  <span className="class-tag">cat</span>
                  <span className="class-tag">bird</span>
                  <span className="class-tag">horse</span>
                  <span className="class-tag">cow</span>
                  <span className="class-tag">sheep</span>
                  <span className="class-tag">elephant</span>
                  <span className="class-tag">bear</span>
                  <span className="class-tag">zebra</span>
                  <span className="class-tag">giraffe</span>
                </div>
              </div>
              <div className="class-category">
                <h4>👤 People & Accessories</h4>
                <div className="class-tags">
                  <span className="class-tag">person</span>
                  <span className="class-tag">backpack</span>
                  <span className="class-tag">umbrella</span>
                  <span className="class-tag">handbag</span>
                  <span className="class-tag">tie</span>
                  <span className="class-tag">suitcase</span>
                </div>
              </div>
              <div className="class-category">
                <h4>🍕 Food & Kitchen</h4>
                <div className="class-tags">
                  <span className="class-tag">bottle</span>
                  <span className="class-tag">cup</span>
                  <span className="class-tag">fork</span>
                  <span className="class-tag">knife</span>
                  <span className="class-tag">spoon</span>
                  <span className="class-tag">bowl</span>
                  <span className="class-tag">banana</span>
                  <span className="class-tag">apple</span>
                  <span className="class-tag">pizza</span>
                  <span className="class-tag">cake</span>
                </div>
              </div>
              <div className="class-category">
                <h4>🏠 Furniture & Indoor</h4>
                <div className="class-tags">
                  <span className="class-tag">chair</span>
                  <span className="class-tag">couch</span>
                  <span className="class-tag">bed</span>
                  <span className="class-tag">dining table</span>
                  <span className="class-tag">toilet</span>
                  <span className="class-tag">tv</span>
                  <span className="class-tag">refrigerator</span>
                  <span className="class-tag">oven</span>
                  <span className="class-tag">sink</span>
                </div>
              </div>
              <div className="class-category">
                <h4>💻 Electronics</h4>
                <div className="class-tags">
                  <span className="class-tag">laptop</span>
                  <span className="class-tag">mouse</span>
                  <span className="class-tag">keyboard</span>
                  <span className="class-tag">cell phone</span>
                  <span className="class-tag">remote</span>
                  <span className="class-tag">microwave</span>
                  <span className="class-tag">toaster</span>
                </div>
              </div>
              <div className="class-category">
                <h4>⚽ Sports & Outdoor</h4>
                <div className="class-tags">
                  <span className="class-tag">sports ball</span>
                  <span className="class-tag">frisbee</span>
                  <span className="class-tag">skis</span>
                  <span className="class-tag">snowboard</span>
                  <span className="class-tag">tennis racket</span>
                  <span className="class-tag">kite</span>
                  <span className="class-tag">baseball bat</span>
                  <span className="class-tag">surfboard</span>
                  <span className="class-tag">skateboard</span>
                </div>
              </div>
              <div className="class-category">
                <h4>🔧 Other Objects</h4>
                <div className="class-tags">
                  <span className="class-tag">traffic light</span>
                  <span className="class-tag">fire hydrant</span>
                  <span className="class-tag">stop sign</span>
                  <span className="class-tag">bench</span>
                  <span className="class-tag">clock</span>
                  <span className="class-tag">vase</span>
                  <span className="class-tag">scissors</span>
                  <span className="class-tag">book</span>
                  <span className="class-tag">potted plant</span>
                </div>
              </div>
            </div>
          </div>

          {/* System Requirements */}
          <div className="system-requirements">
            <h3 className="benchmark-subtitle">💻 System Requirements</h3>
            <div className="requirements-grid">
              <div className="requirement-card">
                <div className="req-header">
                  <span className="req-icon">🖥️</span>
                  <h4>CPU Mode</h4>
                </div>
                <ul className="req-list">
                  <li>Any modern x64 CPU</li>
                  <li>~200-500ms per image</li>
                  <li>4GB RAM minimum</li>
                  <li>Works on all systems</li>
                </ul>
              </div>
              <div className="requirement-card recommended">
                <div className="req-header">
                  <span className="req-icon">🎮</span>
                  <h4>GPU Mode (Recommended)</h4>
                  <span className="req-badge">Best</span>
                </div>
                <ul className="req-list">
                  <li>NVIDIA GPU with CUDA</li>
                  <li>~25-50ms per image</li>
                  <li>8GB VRAM recommended</li>
                  <li>10-20x faster processing</li>
                </ul>
              </div>
              <div className="requirement-card">
                <div className="req-header">
                  <span className="req-icon">📁</span>
                  <h4>Storage</h4>
                </div>
                <ul className="req-list">
                  <li>~40MB for model weights</li>
                  <li>~100MB for dependencies</li>
                  <li>Variable for image data</li>
                  <li>JSON metadata: ~1KB/image</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Limitations & Future Scope Section */}
      <section className="limitations-section" id="limitations-section">
        <div className="section-header">
          <span className="section-badge limitations-badge">⚠️ Important</span>
          <h2>Limitations & Future Scope</h2>
          <p>Understanding what the model can and cannot detect, plus potential improvements</p>
        </div>

        <div className="limitations-content">
          {/* Current Limitations */}
          <div className="limitations-block">
            <h3 className="limitations-subtitle">🚫 Current Limitations</h3>
            <div className="limitation-cards">
              <div className="limitation-card warning">
                <div className="limitation-icon">⚠️</div>
                <h4>Limited to 80 COCO Classes</h4>
                <p>The pre-trained model can <strong>only detect objects from the 80 COCO classes</strong>. Any object outside this list will not be recognized.</p>
                <div className="limitation-example">
                  <span className="example-label">Examples of undetectable objects:</span>
                  <div className="example-tags">
                    <span className="example-tag no">guitar</span>
                    <span className="example-tag no">drone</span>
                    <span className="example-tag no">washing machine</span>
                    <span className="example-tag no">headphones</span>
                    <span className="example-tag no">pen</span>
                    <span className="example-tag no">shoes</span>
                  </div>
                </div>
              </div>

              <div className="limitation-card info">
                <div className="limitation-icon">ℹ️</div>
                <h4>No Custom Training</h4>
                <p>This project uses pre-trained weights from Ultralytics. We did not train or fine-tune the model on custom data.</p>
                <div className="limitation-detail">
                  <span className="detail-label">What this means:</span>
                  <ul>
                    <li>Detection accuracy is based on COCO dataset benchmarks</li>
                    <li>Performance may vary on domain-specific images</li>
                    <li>No project-specific accuracy metrics available</li>
                  </ul>
                </div>
              </div>

              <div className="limitation-card info">
                <div className="limitation-icon">📊</div>
                <h4>Confidence Threshold</h4>
                <p>Objects with confidence scores below 0.3 (30%) are filtered out. This may cause some valid detections to be missed.</p>
                <div className="limitation-detail">
                  <span className="detail-label">Trade-off:</span>
                  <ul>
                    <li>Higher threshold = fewer false positives, may miss objects</li>
                    <li>Lower threshold = more detections, may include errors</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Detection Examples */}
          <div className="detection-examples">
            <h3 className="limitations-subtitle">✅ What Gets Detected vs ❌ What Doesn't</h3>
            <div className="examples-grid">
              <div className="example-column detected">
                <div className="column-header">
                  <span className="column-icon">✅</span>
                  <h4>Detected (In COCO)</h4>
                </div>
                <ul className="example-list">
                  <li><span className="check">✓</span> Person walking on street</li>
                  <li><span className="check">✓</span> Car parked in driveway</li>
                  <li><span className="check">✓</span> Dog playing in park</li>
                  <li><span className="check">✓</span> Laptop on desk</li>
                  <li><span className="check">✓</span> Pizza on table</li>
                  <li><span className="check">✓</span> Bicycle against wall</li>
                </ul>
              </div>
              <div className="example-column not-detected">
                <div className="column-header">
                  <span className="column-icon">❌</span>
                  <h4>Not Detected (Not in COCO)</h4>
                </div>
                <ul className="example-list">
                  <li><span className="cross">✗</span> Guitar on stand</li>
                  <li><span className="cross">✗</span> Drone in sky</li>
                  <li><span className="cross">✗</span> Coffee machine</li>
                  <li><span className="cross">✗</span> Headphones on table</li>
                  <li><span className="cross">✗</span> Watch on wrist</li>
                  <li><span className="cross">✗</span> Pen and notebook</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Future Improvements */}
          <div className="future-scope">
            <h3 className="limitations-subtitle">🚀 Future Improvements & Solutions</h3>
            <div className="future-cards">
              <div className="future-card">
                <div className="future-number">1</div>
                <div className="future-content">
                  <h4>Custom Model Training</h4>
                  <p>Fine-tune YOLOv11 on your own labeled dataset to detect domain-specific objects not in COCO.</p>
                  <div className="future-tags">
                    <span className="future-tag">Requires GPU</span>
                    <span className="future-tag">Labeled Data</span>
                  </div>
                </div>
              </div>
              
              <div className="future-card">
                <div className="future-number">2</div>
                <div className="future-content">
                  <h4>Multi-Model Support</h4>
                  <p>Integrate models trained on larger datasets like Open Images (600+ classes) or LVIS (1000+ classes).</p>
                  <div className="future-tags">
                    <span className="future-tag">More Classes</span>
                    <span className="future-tag">Plug & Play</span>
                  </div>
                </div>
              </div>
              
              <div className="future-card">
                <div className="future-number">3</div>
                <div className="future-content">
                  <h4>Vision-Language Models</h4>
                  <p>Add CLIP or GPT-4 Vision integration for natural language queries and open-vocabulary detection.</p>
                  <div className="future-tags">
                    <span className="future-tag">Any Object</span>
                    <span className="future-tag">Natural Language</span>
                  </div>
                </div>
              </div>
              
              <div className="future-card">
                <div className="future-number">4</div>
                <div className="future-content">
                  <h4>Configurable Confidence</h4>
                  <p>Add UI controls to adjust confidence threshold dynamically based on use case requirements.</p>
                  <div className="future-tags">
                    <span className="future-tag">Flexibility</span>
                    <span className="future-tag">User Control</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="disclaimer-box">
            <div className="disclaimer-icon">📋</div>
            <div className="disclaimer-content">
              <h4>Project Scope Disclaimer</h4>
              <p>This is a <strong>demonstration project</strong> showcasing how to build a full-stack image search application with YOLOv11. It uses pre-trained weights and is intended for educational purposes and proof-of-concept implementations. For production use cases requiring detection of objects beyond COCO classes, custom training or alternative models would be necessary.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack & Architecture Section */}
      <section className="techstack-section" id="techstack-section">
        <div className="section-header">
          <span className="section-badge techstack-badge">🛠️ Under the Hood</span>
          <h2>Tech Stack & Architecture</h2>
          <p>A modern full-stack application with cutting-edge ML integration</p>
        </div>

        <div className="techstack-content">
          <div className="stack-layers">
            <div className="stack-layer frontend-stack">
              <div className="layer-header">
                <span className="layer-icon">⚛️</span>
                <h3>Frontend Layer</h3>
                <span className="layer-port">:3000</span>
              </div>
              <div className="layer-techs">
                <div className="tech-item">
                  <span className="tech-name">React.js</span>
                  <span className="tech-role">UI Framework</span>
                </div>
                <div className="tech-item">
                  <span className="tech-name">Axios</span>
                  <span className="tech-role">HTTP Client</span>
                </div>
                <div className="tech-item">
                  <span className="tech-name">CSS3</span>
                  <span className="tech-role">Styling</span>
                </div>
                <div className="tech-item">
                  <span className="tech-name">React Icons</span>
                  <span className="tech-role">Icons</span>
                </div>
              </div>
            </div>

            <div className="stack-connector">
              <div className="connector-line"></div>
              <span className="connector-label">REST API</span>
              <div className="connector-line"></div>
            </div>

            <div className="stack-layer backend-stack">
              <div className="layer-header">
                <span className="layer-icon">🖥️</span>
                <h3>Backend Layer</h3>
                <span className="layer-port">:5000</span>
              </div>
              <div className="layer-techs">
                <div className="tech-item">
                  <span className="tech-name">Node.js</span>
                  <span className="tech-role">Runtime</span>
                </div>
                <div className="tech-item">
                  <span className="tech-name">Express.js</span>
                  <span className="tech-role">Web Server</span>
                </div>
                <div className="tech-item">
                  <span className="tech-name">Python Shell</span>
                  <span className="tech-role">ML Bridge</span>
                </div>
                <div className="tech-item">
                  <span className="tech-name">File System</span>
                  <span className="tech-role">Storage</span>
                </div>
              </div>
            </div>

            <div className="stack-connector">
              <div className="connector-line"></div>
              <span className="connector-label">Python Subprocess</span>
              <div className="connector-line"></div>
            </div>

            <div className="stack-layer ml-stack">
              <div className="layer-header">
                <span className="layer-icon">🤖</span>
                <h3>ML Layer</h3>
                <span className="layer-port">Python</span>
              </div>
              <div className="layer-techs">
                <div className="tech-item">
                  <span className="tech-name">YOLOv11</span>
                  <span className="tech-role">Object Detection</span>
                </div>
                <div className="tech-item">
                  <span className="tech-name">Ultralytics</span>
                  <span className="tech-role">ML Framework</span>
                </div>
                <div className="tech-item">
                  <span className="tech-name">PyTorch</span>
                  <span className="tech-role">Deep Learning</span>
                </div>
                <div className="tech-item">
                  <span className="tech-name">OpenCV</span>
                  <span className="tech-role">Image Processing</span>
                </div>
              </div>
            </div>
          </div>

          <div className="architecture-flow">
            <h4><FiGitBranch /> Data Flow Pipeline</h4>
            <div className="flow-diagram">
              <div className="flow-step">
                <div className="flow-num">1</div>
                <div className="flow-content">
                  <strong>Upload/Select</strong>
                  <span>Images Directory</span>
                </div>
              </div>
              <div className="flow-arrow">→</div>
              <div className="flow-step">
                <div className="flow-num">2</div>
                <div className="flow-content">
                  <strong>API Request</strong>
                  <span>Express Server</span>
                </div>
              </div>
              <div className="flow-arrow">→</div>
              <div className="flow-step">
                <div className="flow-num">3</div>
                <div className="flow-content">
                  <strong>YOLO Inference</strong>
                  <span>Object Detection</span>
                </div>
              </div>
              <div className="flow-arrow">→</div>
              <div className="flow-step">
                <div className="flow-num">4</div>
                <div className="flow-content">
                  <strong>JSON Metadata</strong>
                  <span>Persist Results</span>
                </div>
              </div>
              <div className="flow-arrow">→</div>
              <div className="flow-step">
                <div className="flow-num">5</div>
                <div className="flow-content">
                  <strong>Search Query</strong>
                  <span>Find Objects</span>
                </div>
              </div>
              <div className="flow-arrow">→</div>
              <div className="flow-step">
                <div className="flow-num">6</div>
                <div className="flow-content">
                  <strong>Display Results</strong>
                  <span>React Grid</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Comparison Section */}
      <section className="comparison-section" id="comparison-section">
        <div className="section-header">
          <span className="section-badge">Market Comparison</span>
          <h2>Object Detection Solutions Compared</h2>
          <p>See how YOLOv11 stacks up against leading cloud-based vision APIs</p>
        </div>

        <div className="comparison-table-wrapper">
          <table className="comparison-table">
            <thead>
              <tr>
                <th className="feature-col">
                  <div className="feature-header">
                    <FiLayers className="feature-header-icon" />
                    <span>Feature</span>
                  </div>
                </th>
                <th className="competitor-col aws">
                  <div className="tech-header">
                    <div className="tech-logo aws-logo">
                      <span>AWS</span>
                    </div>
                    <span className="tech-name">Rekognition</span>
                    <span className="tech-company">Amazon Web Services</span>
                  </div>
                </th>
                <th className="competitor-col google">
                  <div className="tech-header">
                    <div className="tech-logo google-logo">
                      <span>GCP</span>
                    </div>
                    <span className="tech-name">Cloud Vision AI</span>
                    <span className="tech-company">Google Cloud</span>
                  </div>
                </th>
                <th className="competitor-col azure">
                  <div className="tech-header">
                    <div className="tech-logo azure-logo">
                      <span>Azure</span>
                    </div>
                    <span className="tech-name">Computer Vision</span>
                    <span className="tech-company">Microsoft Azure</span>
                  </div>
                </th>
                <th className="competitor-col openai">
                  <div className="tech-header">
                    <div className="tech-logo openai-logo">
                      <span>GPT</span>
                    </div>
                    <span className="tech-name">GPT-4 Vision</span>
                    <span className="tech-company">OpenAI</span>
                  </div>
                </th>
                <th className="competitor-col yolo highlighted">
                  <div className="tech-header">
                    <div className="tech-logo yolo-logo">
                      <span>Y11</span>
                    </div>
                    <span className="tech-name">YOLOv11 Search</span>
                    <span className="tech-company">This Project</span>
                    <span className="recommended-badge">★ Recommended</span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {/* Processing Speed */}
              <tr>
                <td className="feature-name">
                  <FiZap className="feature-icon" />
                  <div>
                    <span>Processing Speed</span>
                    <small>Time per image</small>
                  </div>
                </td>
                <td className="competitor-col aws">
                  <div className="speed-indicator medium">
                    <span className="speed-value">~800ms</span>
                  </div>
                  <p className="feature-note">API latency included</p>
                </td>
                <td className="competitor-col google">
                  <div className="speed-indicator medium">
                    <span className="speed-value">~1.2s</span>
                  </div>
                  <p className="feature-note">Batch processing available</p>
                </td>
                <td className="competitor-col azure">
                  <div className="speed-indicator medium">
                    <span className="speed-value">~900ms</span>
                  </div>
                  <p className="feature-note">Regional endpoints</p>
                </td>
                <td className="competitor-col openai">
                  <div className="speed-indicator slow">
                    <span className="speed-value">~3-5s</span>
                  </div>
                  <p className="feature-note">Complex reasoning</p>
                </td>
                <td className="competitor-col yolo highlighted">
                  <div className="speed-indicator fast">
                    <span className="speed-value">~25ms</span>
                  </div>
                  <p className="feature-note">GPU-accelerated local</p>
                </td>
              </tr>

              {/* Cost Per 1000 Images */}
              <tr>
                <td className="feature-name">
                  <FiDollarSign className="feature-icon" />
                  <div>
                    <span>Cost</span>
                    <small>Per 1,000 images</small>
                  </div>
                </td>
                <td className="competitor-col aws">
                  <span className="price-badge expensive">$1.00</span>
                  <p className="feature-note">First 1M images/month</p>
                </td>
                <td className="competitor-col google">
                  <span className="price-badge expensive">$1.50</span>
                  <p className="feature-note">Object detection tier</p>
                </td>
                <td className="competitor-col azure">
                  <span className="price-badge expensive">$1.00</span>
                  <p className="feature-note">S1 pricing tier</p>
                </td>
                <td className="competitor-col openai">
                  <span className="price-badge very-expensive">$5.00+</span>
                  <p className="feature-note">Token-based pricing</p>
                </td>
                <td className="competitor-col yolo highlighted">
                  <span className="price-badge free">$0.00</span>
                  <p className="feature-note">Forever free, self-hosted</p>
                </td>
              </tr>

              {/* Data Privacy */}
              <tr>
                <td className="feature-name">
                  <FiShield className="feature-icon" />
                  <div>
                    <span>Data Privacy</span>
                    <small>Where data is processed</small>
                  </div>
                </td>
                <td className="competitor-col aws">
                  <div className="privacy-badge cloud">
                    <FiGlobe /> Cloud Upload
                  </div>
                  <p className="feature-note">AWS data centers</p>
                </td>
                <td className="competitor-col google">
                  <div className="privacy-badge cloud">
                    <FiGlobe /> Cloud Upload
                  </div>
                  <p className="feature-note">Google infrastructure</p>
                </td>
                <td className="competitor-col azure">
                  <div className="privacy-badge cloud">
                    <FiGlobe /> Cloud Upload
                  </div>
                  <p className="feature-note">Azure regions</p>
                </td>
                <td className="competitor-col openai">
                  <div className="privacy-badge cloud">
                    <FiGlobe /> Cloud Upload
                  </div>
                  <p className="feature-note">OpenAI servers</p>
                </td>
                <td className="competitor-col yolo highlighted">
                  <div className="privacy-badge local">
                    <FiLock /> 100% Local
                  </div>
                  <p className="feature-note">Never leaves your machine</p>
                </td>
              </tr>

              {/* Offline Capability */}
              <tr>
                <td className="feature-name">
                  <FiWifiOff className="feature-icon" />
                  <div>
                    <span>Offline Mode</span>
                    <small>Works without internet</small>
                  </div>
                </td>
                <td className="competitor-col aws">
                  <div className="availability-badge unavailable">
                    <FiX /> Not Available
                  </div>
                </td>
                <td className="competitor-col google">
                  <div className="availability-badge unavailable">
                    <FiX /> Not Available
                  </div>
                </td>
                <td className="competitor-col azure">
                  <div className="availability-badge partial">
                    <FiCheck /> Container Deploy
                  </div>
                  <p className="feature-note">Extra setup required</p>
                </td>
                <td className="competitor-col openai">
                  <div className="availability-badge unavailable">
                    <FiX /> Not Available
                  </div>
                </td>
                <td className="competitor-col yolo highlighted">
                  <div className="availability-badge available">
                    <FiCheck /> Full Support
                  </div>
                  <p className="feature-note">Complete offline capability</p>
                </td>
              </tr>

              {/* Object Classes */}
              <tr>
                <td className="feature-name">
                  <FiLayers className="feature-icon" />
                  <div>
                    <span>Object Classes</span>
                    <small>Detectable categories</small>
                  </div>
                </td>
                <td className="competitor-col aws">
                  <span className="class-count">1,000+</span>
                  <p className="feature-note">Custom labels extra</p>
                </td>
                <td className="competitor-col google">
                  <span className="class-count">10,000+</span>
                  <p className="feature-note">Largest library</p>
                </td>
                <td className="competitor-col azure">
                  <span className="class-count">10,000+</span>
                  <p className="feature-note">Custom Vision add-on</p>
                </td>
                <td className="competitor-col openai">
                  <span className="class-count">Unlimited</span>
                  <p className="feature-note">Natural language</p>
                </td>
                <td className="competitor-col yolo highlighted">
                  <span className="class-count highlight">80 COCO</span>
                  <p className="feature-note">Optimized common objects</p>
                </td>
              </tr>

              {/* Bounding Box Detection */}
              <tr>
                <td className="feature-name">
                  <FiCpu className="feature-icon" />
                  <div>
                    <span>Detection Type</span>
                    <small>Output format</small>
                  </div>
                </td>
                <td className="competitor-col aws">
                  <span className="detection-type">Bounding Boxes</span>
                  <span className="detection-type">+ Labels</span>
                </td>
                <td className="competitor-col google">
                  <span className="detection-type">Bounding Boxes</span>
                  <span className="detection-type">+ Segmentation</span>
                </td>
                <td className="competitor-col azure">
                  <span className="detection-type">Bounding Boxes</span>
                  <span className="detection-type">+ Captions</span>
                </td>
                <td className="competitor-col openai">
                  <span className="detection-type">Natural Language</span>
                  <span className="detection-type">Description</span>
                </td>
                <td className="competitor-col yolo highlighted">
                  <span className="detection-type">Bounding Boxes</span>
                  <span className="detection-type">+ Confidence %</span>
                </td>
              </tr>

              {/* Setup Complexity */}
              <tr>
                <td className="feature-name">
                  <FiServer className="feature-icon" />
                  <div>
                    <span>Setup Complexity</span>
                    <small>Time to get started</small>
                  </div>
                </td>
                <td className="competitor-col aws">
                  <div className="complexity-indicator medium">
                    <span>Medium</span>
                  </div>
                  <p className="feature-note">IAM, SDK setup</p>
                </td>
                <td className="competitor-col google">
                  <div className="complexity-indicator medium">
                    <span>Medium</span>
                  </div>
                  <p className="feature-note">API key, billing</p>
                </td>
                <td className="competitor-col azure">
                  <div className="complexity-indicator medium">
                    <span>Medium</span>
                  </div>
                  <p className="feature-note">Resource groups</p>
                </td>
                <td className="competitor-col openai">
                  <div className="complexity-indicator easy">
                    <span>Easy</span>
                  </div>
                  <p className="feature-note">API key only</p>
                </td>
                <td className="competitor-col yolo highlighted">
                  <div className="complexity-indicator easy">
                    <span>Easy</span>
                  </div>
                  <p className="feature-note">pip install + run</p>
                </td>
              </tr>

              {/* Batch Processing */}
              <tr>
                <td className="feature-name">
                  <FiTrendingUp className="feature-icon" />
                  <div>
                    <span>Batch Processing</span>
                    <small>Multiple images at once</small>
                  </div>
                </td>
                <td className="competitor-col aws">
                  <div className="availability-badge available">
                    <FiCheck /> Supported
                  </div>
                  <p className="feature-note">S3 integration</p>
                </td>
                <td className="competitor-col google">
                  <div className="availability-badge available">
                    <FiCheck /> Supported
                  </div>
                  <p className="feature-note">GCS integration</p>
                </td>
                <td className="competitor-col azure">
                  <div className="availability-badge available">
                    <FiCheck /> Supported
                  </div>
                  <p className="feature-note">Blob storage</p>
                </td>
                <td className="competitor-col openai">
                  <div className="availability-badge partial">
                    <FiX /> Limited
                  </div>
                  <p className="feature-note">Sequential only</p>
                </td>
                <td className="competitor-col yolo highlighted">
                  <div className="availability-badge available">
                    <FiCheck /> Unlimited
                  </div>
                  <p className="feature-note">Local folder scan</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Summary Stats */}
        <div className="tech-stats">
          <div className="stat-card">
            <div className="stat-icon speed-icon">
              <FiZap />
            </div>
            <div className="stat-value">80</div>
            <div className="stat-label">Object Classes</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon privacy-icon">
              <FiShield />
            </div>
            <div className="stat-value">100%</div>
            <div className="stat-label">Local Processing</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon cost-icon">
              <FiDollarSign />
            </div>
            <div className="stat-value">$0</div>
            <div className="stat-label">No API Costs</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon offline-icon">
              <FiWifiOff />
            </div>
            <div className="stat-value">✓</div>
            <div className="stat-label">Works Offline</div>
          </div>
        </div>
      </section>

      {/* Comprehensive Project Overview Section */}
      <section className="project-overview-section" id="project-overview-section">
        <div className="section-header">
          <span className="section-badge overview-badge">🎓 Beginner's Guide</span>
          <h2>Complete Project Architecture</h2>
          <p>Understand how every component works together - from ML model to web interface</p>
        </div>


        {/* Detailed Architecture Diagram */}
        <div className="architecture-diagram">
          <h3 className="subsection-title">📊 System Architecture Diagram</h3>
          <div className="diagram-container">
            {/* User Layer */}
            <div className="diagram-layer user-layer">
              <div className="layer-label">👤 User Layer</div>
              <div className="layer-content">
                <div className="diagram-box browser-box">
                  <span className="box-icon">🌐</span>
                  <span className="box-title">Web Browser</span>
                  <span className="box-desc">localhost:3000</span>
                </div>
              </div>
            </div>

            <div className="diagram-arrow-down">
              <div className="arrow-line"></div>
              <div className="arrow-label">HTTP Requests</div>
            </div>

            {/* Frontend Layer */}
            <div className="diagram-layer frontend-layer">
              <div className="layer-label">⚛️ Frontend Layer (React)</div>
              <div className="layer-content">
                <div className="diagram-box component-box">
                  <span className="box-title">ProcessPanel</span>
                  <span className="box-desc">Image Processing UI</span>
                </div>
                <div className="diagram-box component-box">
                  <span className="box-title">SearchPanel</span>
                  <span className="box-desc">Search Interface</span>
                </div>
                <div className="diagram-box component-box">
                  <span className="box-title">ResultsGrid</span>
                  <span className="box-desc">Display Results</span>
                </div>
              </div>
            </div>

            <div className="diagram-arrow-down">
              <div className="arrow-line"></div>
              <div className="arrow-label">REST API (Axios)</div>
            </div>

            {/* Backend Layer */}
            <div className="diagram-layer backend-layer">
              <div className="layer-label">🖥️ Backend Layer (Node.js + Express)</div>
              <div className="layer-content">
                <div className="diagram-box api-box">
                  <span className="box-title">/api/process-directory</span>
                  <span className="box-desc">Trigger YOLO Processing</span>
                </div>
                <div className="diagram-box api-box">
                  <span className="box-title">/api/search</span>
                  <span className="box-desc">Query Metadata</span>
                </div>
                <div className="diagram-box api-box">
                  <span className="box-title">/api/load-metadata</span>
                  <span className="box-desc">Load Existing Data</span>
                </div>
              </div>
            </div>

            <div className="diagram-arrow-down">
              <div className="arrow-line"></div>
              <div className="arrow-label">Python Shell Execution</div>
            </div>

            {/* ML Layer */}
            <div className="diagram-layer ml-layer">
              <div className="layer-label">🤖 ML Layer (Python + YOLOv11)</div>
              <div className="layer-content">
                <div className="diagram-box ml-box">
                  <span className="box-title">process_directory.py</span>
                  <span className="box-desc">Entry Point Script</span>
                </div>
                <div className="diagram-box ml-box highlight">
                  <span className="box-title">inference.py</span>
                  <span className="box-desc">YOLOv11 Detection</span>
                </div>
                <div className="diagram-box ml-box">
                  <span className="box-title">utils.py</span>
                  <span className="box-desc">Helper Functions</span>
                </div>
              </div>
            </div>

            <div className="diagram-arrow-down">
              <div className="arrow-line"></div>
              <div className="arrow-label">Read/Write Files</div>
            </div>

            {/* Storage Layer */}
            <div className="diagram-layer storage-layer">
              <div className="layer-label">💾 Storage Layer (File System)</div>
              <div className="layer-content">
                <div className="diagram-box storage-box">
                  <span className="box-title">data/raw/</span>
                  <span className="box-desc">Original Images</span>
                </div>
                <div className="diagram-box storage-box">
                  <span className="box-title">data/processed/</span>
                  <span className="box-desc">Detection Results</span>
                </div>
                <div className="diagram-box storage-box">
                  <span className="box-title">metadata.json</span>
                  <span className="box-desc">Searchable Index</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Data Flow Explanation */}
        <div className="data-flow-section">
          <h3 className="subsection-title">🔄 How Data Flows Through the System</h3>
          <div className="flow-steps">
            <div className="flow-step">
              <div className="flow-step-number">1</div>
              <div className="flow-step-content">
                <h4>📁 User Selects Images</h4>
                <p>Point to a folder containing images (JPG, PNG, etc.) or upload files directly through the web interface.</p>
                <code>Example: data/raw/my-photos/</code>
              </div>
            </div>
            
            <div className="flow-step">
              <div className="flow-step-number">2</div>
              <div className="flow-step-content">
                <h4>🚀 API Request Sent</h4>
                <p>React frontend sends a POST request to the Express backend with the folder path.</p>
                <code>POST /api/process-directory {"{"}"imageDir": "data/raw/my-photos"{"}"}</code>
              </div>
            </div>
            
            <div className="flow-step">
              <div className="flow-step-number">3</div>
              <div className="flow-step-content">
                <h4>🐍 Python Script Executed</h4>
                <p>Node.js spawns a Python process that loads the YOLOv11 model and processes each image.</p>
                <code>python process_directory.py --image_dir "data/raw/my-photos"</code>
              </div>
            </div>
            
            <div className="flow-step">
              <div className="flow-step-number">4</div>
              <div className="flow-step-content">
                <h4>🎯 Object Detection</h4>
                <p>YOLOv11 analyzes each image and identifies objects with bounding boxes and confidence scores.</p>
                <code>Detected: person (95%), car (87%), dog (72%)</code>
              </div>
            </div>
            
            <div className="flow-step">
              <div className="flow-step-number">5</div>
              <div className="flow-step-content">
                <h4>💾 Metadata Saved</h4>
                <p>Detection results are saved as a JSON file containing all objects found in each image.</p>
                <code>data/processed/batch-id/metadata.json</code>
              </div>
            </div>
            
            <div className="flow-step">
              <div className="flow-step-number">6</div>
              <div className="flow-step-content">
                <h4>🔍 Search Ready</h4>
                <p>Users can now search by object class (e.g., "find all images with cats") and get instant results!</p>
                <code>Search: "cat" → Returns 15 matching images</code>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Professional Project Summary */}
      <section className="project-summary-section" id="project-summary-section">
        <div className="section-header">
          <span className="section-badge">Project Overview</span>
          <h2>YOLOv11 Image Search: Technical Summary</h2>
          <p>
            This application combines a modern React frontend, Node.js/Express backend, and a Python-based YOLOv11 inference engine to deliver fast, private, and accurate object-based image search. All processing is performed locally or on your own server, ensuring data privacy and full control. The system is designed for extensibility and can be adapted for custom datasets or advanced search features.
          </p>
        </div>
      </section>

      {/* Main Processing Panel */}
      <section className="process-panel" id="process-section">
        <div className="panel-header">
          <div className="panel-title">
            <FiCpu className="panel-icon" />
            <div>
              <h2>Image Processing Pipeline</h2>
              <p>Run YOLOv11 inference or load existing detection data</p>
            </div>
          </div>
        </div>

        <div className="mode-selector">
          {/* Only two options: Detect Objects and Load Dataset */}
          <button
            className={`mode-btn ${mode === 'load' ? 'active' : ''}`}
            onClick={() => setMode('load')}
            disabled={loading}
          >
            <FiDatabase className="mode-icon" />
            <div className="mode-text">
              <span className="mode-title">Load Dataset</span>
              <span className="mode-desc">Use existing metadata</span>
            </div>
          </button>
          <button
            className={`mode-btn ${mode === 'upload' ? 'active' : ''}`}
            onClick={() => setMode('upload')}
            disabled={loading}
          >
            <FiCamera className="mode-icon" />
            <div className="mode-text">
              <span className="mode-title">Detect Objects</span>
              <span className="mode-desc">Upload & analyze single image</span>
            </div>
          </button>
        </div>

        {mode === 'load' && (
          <div className="mode-content">
            <div className="input-group">
              <label>
                <FiUploadCloud className="input-icon" />
                Metadata File Path
              </label>
              <div className="input-wrapper">
                <input
                  type="text"
                  value={metadataPath}
                  onChange={(e) => setMetadataPath(e.target.value)}
                  placeholder="data/processed/dataset/metadata.json"
                  disabled={loading}
                />
              </div>
              <span className="input-hint">Path to metadata.json file</span>
            </div>

            <button
              className="action-btn primary"
              onClick={handleLoadMetadata}
              disabled={loading}
            >
              {loading ? (
                <>
                  <FiLoader className="spinning" />
                  Loading Dataset...
                </>
              ) : (
                <>
                  <FiDatabase />
                  Load Metadata
                </>
              )}
            </button>

            {lastProcessedCount > 0 && mode === 'load' && (
              <div className="success-card">
                <div className="success-header">
                  <FiCheck className="success-icon" />
                  <span>Dataset Loaded</span>
                </div>
                <div className="success-details">
                  <div className="detail-item">
                    <span className="detail-label">Total Images</span>
                    <span className="detail-value highlight">{lastProcessedCount}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Source</span>
                    <span className="detail-value">{metadataPath.split('/').pop()}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {mode === 'upload' && (
          <div className="mode-content">
            {/* Upload Area */}
            <div className="upload-section">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageSelect}
                accept="image/jpeg,image/png,image/gif,image/webp"
                style={{ display: 'none' }}
                disabled={loading}
              />
              
              {!imagePreview ? (
                <div 
                  className="upload-dropzone"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="dropzone-content">
                    <FiUpload className="dropzone-icon" />
                    <h3>Upload an Image</h3>
                    <p>Click to select or drag & drop</p>
                    <span className="dropzone-hint">Supports: JPEG, PNG, GIF, WebP</span>
                  </div>
                </div>
              ) : (
                <div className="image-preview-container">
                  <div className="preview-header">
                    <span className="preview-filename">
                      <FiImage /> {uploadedImage?.name}
                    </span>
                    <button 
                      className="clear-btn"
                      onClick={handleClearImage}
                      disabled={loading}
                    >
                      <FiX /> Remove
                    </button>
                  </div>
                  <div className="preview-image-wrapper">
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      className="preview-image"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Detect Button */}
            {imagePreview && (
              <button
                className="action-btn primary detect-btn"
                onClick={handleDetectImage}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <FiLoader className="spinning" />
                    Analyzing Image...
                  </>
                ) : (
                  <>
                    <FiTarget />
                    Detect Objects
                  </>
                )}
              </button>
            )}

            {/* Detection Results */}
            {detectionResult && detectionResult.detection && (
              <div className="detection-results">
                <div className="results-header">
                  <FiCheck className="success-icon" />
                  <h3>Detection Complete!</h3>
                </div>
                
                <div className="results-summary">
                  <div className="summary-stat">
                    <span className="stat-number">{detectionResult.detection.total_objects}</span>
                    <span className="stat-label">Objects Detected</span>
                  </div>
                  <div className="summary-stat">
                    <span className="stat-number">{detectionResult.detection.unique_classes?.length || 0}</span>
                    <span className="stat-label">Unique Classes</span>
                  </div>
                </div>

                {detectionResult.detection.class_counts && Object.keys(detectionResult.detection.class_counts).length > 0 ? (
                  <div className="detected-objects">
                    <h4>🎯 Detected Objects</h4>
                    <div className="object-chips">
                      {Object.entries(detectionResult.detection.class_counts).map(([className, count]) => (
                        <div key={className} className="object-chip">
                          <span className="chip-name">{className}</span>
                          <span className="chip-count">{count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="no-detections">
                    <FiSearch />
                    <p>No objects detected in this image</p>
                    <span>Try uploading an image with recognizable objects from the COCO dataset classes</span>
                  </div>
                )}

                {detectionResult.detection.detections && detectionResult.detection.detections.length > 0 && (
                  <div className="detection-details">
                    <h4>📊 Detection Details</h4>
                    <div className="details-table">
                      <div className="table-header">
                        <span>Object</span>
                        <span>Confidence</span>
                      </div>
                      {detectionResult.detection.detections.slice(0, 10).map((det, idx) => (
                        <div key={idx} className="table-row">
                          <span className="det-class">{det.class}</span>
                          <span className="det-confidence">
                            <div className="confidence-bar">
                              <div 
                                className="confidence-fill"
                                style={{ width: `${(det.confidence * 100).toFixed(0)}%` }}
                              />
                            </div>
                            {(det.confidence * 100).toFixed(1)}%
                          </span>
                        </div>
                      ))}
                      {detectionResult.detection.detections.length > 10 && (
                        <div className="table-row more-items">
                          <span>+ {detectionResult.detection.detections.length - 10} more detections</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}

export default ProcessPanel;
