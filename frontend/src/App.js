import React, { useState, useEffect } from 'react';
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

      {/* Navigation Bar */}}
      <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
        <div className="nav-container">
          <a href="https://satyamkumarcode.com/index.html#home" className="logo">
            <span>SK</span>
          </a>

          <button 
            className={`mobile-toggle ${mobileMenuOpen ? 'active' : ''}`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <FiX /> : <FiMenu />}
          </button>

          <ul className={`nav-links ${mobileMenuOpen ? 'active' : ''}`}>
            <li>
              <a href="https://satyamkumarcode.com/index.html#home" className="nav-link">
                Home
              </a>
            </li>
            <li>
              <a href="https://satyamkumarcode.com/index.html#about" className="nav-link">
                About
              </a>
            </li>
            <li>
              <a href="https://satyamkumarcode.com/index.html#skills" className="nav-link">
                Skills
              </a>
            </li>
            <li>
              <a href="https://satyamkumarcode.com/index.html#projects" className="nav-link">
                Projects
              </a>
            </li>
            <li>
              <a href="https://satyamkumarcode.com/index.html#certifications" className="nav-link">
                Certificates
              </a>
            </li>
            <li>
              <a href="https://satyamkumarcode.com/index.html#contact" className="nav-link">
                Contact
              </a>
            </li>
          </ul>

          <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
            {theme === 'dark' ? <FiSun className="sun-icon" /> : <FiMoon className="moon-icon" />}
          </button>
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
        <p>Built with 💜 by <span className="gradient-text">Satyam Kumar</span> | Powered by YOLOv11</p>
      </footer>
    </div>
  );
}

export default App;
