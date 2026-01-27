import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/SearchPanel.css';
import { FiSearch, FiFilter, FiLayers, FiCheck, FiX, FiChevronDown, FiZap } from 'react-icons/fi';

function SearchPanel({ metadata, onSearch, onError }) {
  const [uniqueClasses, setUniqueClasses] = useState([]);
  const [countOptions, setCountOptions] = useState({});
  const [selectedClasses, setSelectedClasses] = useState([]);
  const [searchMode, setSearchMode] = useState('OR');
  const [thresholds, setThresholds] = useState({});
  const [loading, setLoading] = useState(false);
  const [showAllClasses, setShowAllClasses] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchClasses();
  }, [metadata]);

  const fetchClasses = async () => {
    try {
      const response = await axios.post('/api/get-classes', { metadata });
      setUniqueClasses(response.data.classes);
      setCountOptions(response.data.countOptions);
      setThresholds({});
      setSelectedClasses([]);
    } catch (error) {
      onError('Error fetching classes');
    }
  };

  const toggleClass = (cls) => {
    if (selectedClasses.includes(cls)) {
      setSelectedClasses(selectedClasses.filter(c => c !== cls));
      const newThresholds = { ...thresholds };
      delete newThresholds[cls];
      setThresholds(newThresholds);
    } else {
      setSelectedClasses([...selectedClasses, cls]);
      setThresholds({ ...thresholds, [cls]: 'None' });
    }
  };

  const handleThresholdChange = (cls, threshold) => {
    setThresholds({ ...thresholds, [cls]: threshold });
  };

  const clearSelection = () => {
    setSelectedClasses([]);
    setThresholds({});
  };

  const handleSearch = async () => {
    if (selectedClasses.length === 0) {
      onError('Please select at least one class');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('/api/search', {
        metadata,
        searchParams: {
          selectedClasses,
          searchMode,
          thresholds
        }
      });

      if (response.data.success) {
        onSearch(response.data.results);
      }
    } catch (error) {
      onError(error.response?.data?.error || 'Search error');
    } finally {
      setLoading(false);
    }
  };

  // Filter classes based on search query
  const filteredClasses = uniqueClasses.filter(cls => 
    cls.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Show limited classes unless expanded
  const displayedClasses = showAllClasses ? filteredClasses : filteredClasses.slice(0, 20);

  return (
    <div className="search-panel">
      {/* Header */}
      <div className="search-panel-header">
        <div className="header-content">
          <div className="header-icon">
            <FiSearch />
          </div>
          <div className="header-text">
            <h2>Object Search Engine</h2>
            <p>Query your image dataset by detected objects</p>
          </div>
        </div>
        <div className="header-stats">
          <div className="stat-pill">
            <FiLayers />
            <span><strong>{uniqueClasses.length}</strong> Classes</span>
          </div>
          <div className="stat-pill">
            <FiFilter />
            <span><strong>{metadata?.length || 0}</strong> Images</span>
          </div>
        </div>
      </div>

      <div className="search-content">
        {/* Search Mode Toggle */}
        <div className="search-section">
          <div className="section-label">
            <FiZap className="section-icon" />
            <span>Search Mode</span>
          </div>
          <div className="mode-toggle-group">
            <button 
              className={`mode-toggle ${searchMode === 'OR' ? 'active' : ''}`}
              onClick={() => setSearchMode('OR')}
            >
              <div className="mode-content">
                <span className="mode-name">Match Any</span>
                <span className="mode-desc">OR logic - find images with any selected object</span>
              </div>
            </button>
            <button 
              className={`mode-toggle ${searchMode === 'AND' ? 'active' : ''}`}
              onClick={() => setSearchMode('AND')}
            >
              <div className="mode-content">
                <span className="mode-name">Match All</span>
                <span className="mode-desc">AND logic - find images with all selected objects</span>
              </div>
            </button>
          </div>
        </div>

        {/* Class Selection */}
        <div className="search-section">
          <div className="section-header">
            <div className="section-label">
              <FiLayers className="section-icon" />
              <span>Select Object Classes</span>
            </div>
            {selectedClasses.length > 0 && (
              <button className="clear-btn" onClick={clearSelection}>
                <FiX /> Clear ({selectedClasses.length})
              </button>
            )}
          </div>

          {/* Search Filter */}
          <div className="class-search">
            <FiSearch className="search-icon" />
            <input
              type="text"
              placeholder="Filter classes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Selected Classes Pills */}
          {selectedClasses.length > 0 && (
            <div className="selected-classes">
              {selectedClasses.map(cls => (
                <div key={cls} className="selected-pill">
                  <span>{cls}</span>
                  <button onClick={() => toggleClass(cls)}>
                    <FiX />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Class Grid */}
          <div className="class-grid">
            {displayedClasses.map((cls) => (
              <button
                key={cls}
                className={`class-chip ${selectedClasses.includes(cls) ? 'selected' : ''}`}
                onClick={() => toggleClass(cls)}
              >
                <span className="chip-check">
                  {selectedClasses.includes(cls) ? <FiCheck /> : null}
                </span>
                <span className="chip-name">{cls}</span>
              </button>
            ))}
          </div>

          {/* Show More Button */}
          {filteredClasses.length > 20 && (
            <button 
              className="show-more-btn"
              onClick={() => setShowAllClasses(!showAllClasses)}
            >
              <FiChevronDown className={showAllClasses ? 'rotated' : ''} />
              {showAllClasses ? 'Show Less' : `Show ${filteredClasses.length - 20} More`}
            </button>
          )}
        </div>

        {/* Thresholds */}
        {selectedClasses.length > 0 && (
          <div className="search-section thresholds-section">
            <div className="section-label">
              <FiFilter className="section-icon" />
              <span>Count Thresholds</span>
              <span className="optional-badge">Optional</span>
            </div>
            <p className="section-hint">Set minimum object count per class</p>
            <div className="thresholds-grid">
              {selectedClasses.map((cls) => (
                <div key={cls} className="threshold-card">
                  <span className="threshold-class">{cls}</span>
                  <div className="threshold-select-wrapper">
                    <select
                      value={thresholds[cls] || 'None'}
                      onChange={(e) => handleThresholdChange(cls, e.target.value)}
                    >
                      <option value="None">Any count</option>
                      {countOptions[cls]?.map((count) => (
                        <option key={count} value={count}>
                          ≥ {count} instances
                        </option>
                      ))}
                    </select>
                    <FiChevronDown className="select-arrow" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Search Button */}
        <div className="search-actions">
          <button
            className="search-btn"
            onClick={handleSearch}
            disabled={loading || selectedClasses.length === 0}
          >
            {loading ? (
              <>
                <span className="btn-spinner"></span>
                Searching...
              </>
            ) : (
              <>
                <FiSearch />
                Search {selectedClasses.length > 0 ? `(${selectedClasses.length} classes)` : 'Images'}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default SearchPanel;
