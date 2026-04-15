import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './App.css';
import ProcessPanel from './components/ProcessPanel';
import SearchPanel from './components/SearchPanel';
import ResultsGrid from './components/ResultsGrid';
import SideNav from './components/SideNav';
import { FiSun, FiMoon, FiMenu, FiX } from 'react-icons/fi';

function App() {
  const [metadata, setMetadata] = useState(null);
  const [error, setError] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [theme, setTheme] = useState('dark');
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [datasetLoaded, setDatasetLoaded] = useState(false);

  // Close mobile menu when clicking a link
  const closeMobileMenu = useCallback(() => {
    setMobileMenuOpen(false);
  }, []);

  // Close mobile menu on window resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768 && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [mobileMenuOpen]);

  // Prevent scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  // Auto-load COCO dataset on startup
  useEffect(() => {
    const loadDefaultDataset = async () => {
      try {
        const response = await axios.post('/api/load-metadata', {
          metadataPath: 'data/processed/coco-val-2017-500/metadata.json'
        });
        if (response.data.success) {
          setMetadata(response.data.metadata);
          setDatasetLoaded(true);
        }
      } catch (err) {
        console.log('Default dataset not available, user can process manually');
      }
    };
    loadDefaultDataset();
  }, []);

  // Theme toggle
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme);
    document.body.setAttribute('data-theme', savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    document.body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  };

  // Scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Generate particles
  useEffect(() => {
    const particlesBg = document.getElementById('particlesBg');
    if (particlesBg && particlesBg.children.length === 0) {
      for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 20 + 's';
        particle.style.animationDuration = (15 + Math.random() * 10) + 's';
        particlesBg.appendChild(particle);
      }
    }
  }, []);

  const handleProcessComplete = (newMetadata) => {
    setMetadata(newMetadata);
    setSearchResults([]);
    setError(null);
  };

  const handleLoadMetadata = (loadedMetadata) => {
    setMetadata(loadedMetadata);
    setSearchResults([]);
    setError(null);
  };

  const handleSearch = (results) => {
    setSearchResults(results);
  };

  const handleError = (errorMsg) => {
    setError(errorMsg);
  };

  return (
    <div className="App">
      {/* Particles Background */}
      <div className="particles-bg" id="particlesBg"></div>

      {/* Gradient Background Orbs */}
      <div className="gradient-bg">
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>
        <div className="orb orb-3"></div>
      </div>

      {/* Side Navigation */}
      <SideNav />

      {/* Navigation Bar */}
      <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
        <div className="nav-container">
          <a href="https://satyamkumarcode.com/index.html#home" className="logo">
            <span>SK</span>
          </a>

          <ul className={`nav-links ${mobileMenuOpen ? 'active' : ''}`}>
            <li>
              <a href="https://satyamkumarcode.com/index.html#home" className="nav-link" onClick={closeMobileMenu}>
                Home
              </a>
            </li>
            <li>
              <a href="https://satyamkumarcode.com/index.html#about" className="nav-link" onClick={closeMobileMenu}>
                About
              </a>
            </li>
            <li>
              <a href="https://satyamkumarcode.com/index.html#skills" className="nav-link" onClick={closeMobileMenu}>
                Skills
              </a>
            </li>
            <li>
              <a href="https://satyamkumarcode.com/index.html#projects" className="nav-link" onClick={closeMobileMenu}>
                Projects
              </a>
            </li>
            <li>
              <a href="https://satyamkumarcode.com/index.html#certifications" className="nav-link" onClick={closeMobileMenu}>
                Certificates
              </a>
            </li>
            <li>
              <a href="https://satyamkumarcode.com/index.html#contact" className="nav-link" onClick={closeMobileMenu}>
                Contact
              </a>
            </li>
          </ul>

          <div className="nav-actions">
            <button 
              className="theme-toggle" 
              onClick={toggleTheme} 
              onTouchEnd={(e) => { e.preventDefault(); toggleTheme(); }}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <FiSun className="sun-icon" /> : <FiMoon className="moon-icon" />}
            </button>
            
            <button 
              className={`mobile-toggle ${mobileMenuOpen ? 'active' : ''}`}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <FiX /> : <FiMenu />}
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero" id="hero-section">
        <div className="hero-container">
          <div className="hero-content">
            <p className="greeting">🎯 Computer Vision Project</p>
            <h1 className="hero-title">YOLOv11 Image Search</h1>
            <div className="role">
              AI-Powered <span className="highlight">Object Detection</span> & Visual Search
            </div>
            <p className="hero-description">
              Upload images, run YOLOv11 inference to detect objects, and search through your image collection 
              using intelligent object-based queries. Built with Python, React, and cutting-edge AI.
            </p>
          </div>
        </div>
      </section>

      <div className="container">
        {error && (
          <div className="error-banner">
            <p>⚠️ {error}</p>
            <button onClick={() => setError(null)}>×</button>
          </div>
        )}

        <main className="main-content">
          <ProcessPanel
            onProcessComplete={handleProcessComplete}
            onLoadMetadata={handleLoadMetadata}
            onError={handleError}
          />

          {metadata && (
            <div id="search-section">
              <SearchPanel
                metadata={metadata}
                onSearch={handleSearch}
                onError={handleError}
              />
            </div>
          )}
        </main>

        {searchResults.length > 0 && (
          <div id="results-section">
            <ResultsGrid
              results={searchResults}
              metadata={metadata}
            />
          </div>
        )}


      </div>

      <footer className="app-footer">
        <p>
          Built with <span role="img" aria-label="love">💜</span> by <span className="gradient-text">Satyam Kumar</span> |
          Powered by YOLOv11
        </p>
        <div style={{ marginTop: '0.5em', fontSize: '1em', display: 'flex', justifyContent: 'center', gap: '1.5em', flexWrap: 'wrap' }}>
          <a href="mailto:satyamkumarcode@gmail.com" style={{ color: '#6c63ff', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.3em' }} target="_blank" rel="noopener noreferrer">
            <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24" style={{verticalAlign:'middle'}}><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 2v.01L12 13 4 6.01V6h16zM4 20v-9.99l7.99 7.99c.39.39 1.02.39 1.41 0L20 10.01V20H4z"/></svg>
            satyamkumarcode@gmail.com
          </a>
          <a href="https://github.com/satyamkumarcode" style={{ color: '#333', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.3em' }} target="_blank" rel="noopener noreferrer">
            <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24" style={{verticalAlign:'middle'}}><path d="M12 2C6.48 2 2 6.58 2 12.26c0 4.5 2.87 8.32 6.84 9.67.5.09.68-.22.68-.48 0-.24-.01-.87-.01-1.7-2.78.62-3.37-1.36-3.37-1.36-.45-1.18-1.1-1.5-1.1-1.5-.9-.63.07-.62.07-.62 1 .07 1.53 1.05 1.53 1.05.89 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.37-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.7 0 0 .84-.28 2.75 1.05A9.38 9.38 0 0 1 12 6.84c.85.004 1.71.12 2.51.35 1.91-1.33 2.75-1.05 2.75-1.05.55 1.4.2 2.44.1 2.7.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.81-4.57 5.07.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.81 0 .27.18.58.69.48A10.01 10.01 0 0 0 22 12.26C22 6.58 17.52 2 12 2z"/></svg>
            github.com/satyamkumarcode
          </a>
          <a href="https://www.linkedin.com/in/satyamkumarcode/" style={{ color: '#0a66c2', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.3em' }} target="_blank" rel="noopener noreferrer">
            <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24" style={{verticalAlign:'middle'}}><path d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11 19h-3v-9h3v9zm-1.5-10.28c-.97 0-1.75-.79-1.75-1.75s.78-1.75 1.75-1.75 1.75.79 1.75 1.75-.78 1.75-1.75 1.75zm15.5 10.28h-3v-4.5c0-1.08-.02-2.47-1.5-2.47-1.5 0-1.73 1.17-1.73 2.39v4.58h-3v-9h2.89v1.23h.04c.4-.75 1.38-1.54 2.84-1.54 3.04 0 3.6 2 3.6 4.59v4.72z"/></svg>
            linkedin.com/in/satyamkumarcode
          </a>
        </div>
      </footer>
    </div>
  );
}

export default App;
