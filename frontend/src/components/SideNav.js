import React, { useState, useEffect } from 'react';
import '../styles/SideNav.css';
import { FiHome, FiSearch, FiImage, FiCpu, FiLayers, FiBarChart2, FiZap, FiGitBranch, FiBox, FiTarget, FiStar, FiCode, FiActivity, FiAlertCircle } from 'react-icons/fi';

function SideNav() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [scrollProgress, setScrollProgress] = useState(0);

  // Track scroll progress
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(progress);

      const sections = [
        'hero-section',
        'problem-section',
        'features-section',
        'benchmarks-section',
        'limitations-section',
        'techstack-section',
        'comparison-section', 
        'project-overview-section',
        'architecture-section',
        'process-section',
        'search-section',
        'results-section'
      ];
      
      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 200 && rect.bottom >= 200) {
            setActiveSection(sectionId.replace('-section', ''));
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId, itemId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveSection(itemId);
    }
  };

  const navItems = [
    { id: 'hero', icon: <FiHome />, label: 'Home', section: 'hero-section' },
    { id: 'problem', icon: <FiTarget />, label: 'Problem', section: 'problem-section' },
    { id: 'features', icon: <FiStar />, label: 'Features', section: 'features-section' },
    { id: 'benchmarks', icon: <FiActivity />, label: 'Benchmarks', section: 'benchmarks-section' },
    { id: 'limitations', icon: <FiAlertCircle />, label: 'Limitations', section: 'limitations-section' },
    { id: 'techstack', icon: <FiCode />, label: 'Tech Stack', section: 'techstack-section' },
    { id: 'comparison', icon: <FiBarChart2 />, label: 'Compare', section: 'comparison-section' },
    { id: 'project-overview', icon: <FiGitBranch />, label: 'Overview', section: 'project-overview-section' },
    { id: 'architecture', icon: <FiBox />, label: 'Flow', section: 'architecture-section' },
    { id: 'process', icon: <FiCpu />, label: 'Process', section: 'process-section' },
    { id: 'search', icon: <FiSearch />, label: 'Search', section: 'search-section' },
    { id: 'results', icon: <FiImage />, label: 'Results', section: 'results-section' },
  ];

  return (
    <>
      {/* Floating trigger with progress indicator */}
      <div 
        className={`sidenav-trigger ${isExpanded ? 'hidden' : ''}`}
        onMouseEnter={() => setIsExpanded(true)}
      >
        <div className="trigger-track">
          <div 
            className="trigger-progress" 
            style={{ height: `${scrollProgress}%` }}
          ></div>
        </div>
        <div className="trigger-pulse"></div>
      </div>

      {/* Navigation Panel */}
      <nav 
        className={`sidenav ${isExpanded ? 'expanded' : ''}`}
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
      >
        {/* Progress bar at top */}
        <div className="sidenav-progress-bar">
          <div 
            className="sidenav-progress-fill" 
            style={{ width: `${scrollProgress}%` }}
          ></div>
        </div>
        
        <ul className="sidenav-menu">
          {navItems.map((item, index) => (
            <li key={item.id} className="sidenav-item" style={{ '--delay': `${index * 0.04}s` }}>
              <button 
                onClick={() => scrollToSection(item.section, item.id)}
                className={`sidenav-link ${activeSection === item.id ? 'active' : ''}`}
                title={item.label}
              >
                <span className="sidenav-icon">{item.icon}</span>
                <span className="sidenav-label">{item.label}</span>
                {activeSection === item.id && <span className="sidenav-dot"></span>}
              </button>
            </li>
          ))}
        </ul>

        {/* Scroll to top button */}
        <button 
          className="sidenav-top-btn"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          title="Back to top"
        >
          <FiZap />
        </button>
      </nav>
    </>
  );
}

export default SideNav;
