import React, { useState, useEffect } from 'react';
import { SearchBar } from './components/SearchBar';
import { Resume } from './components/Resume';
import { runOrchestrator } from './agents/orchestrator';
import { formatWithGroq } from './utils/groqFormatter';
import { exportToPDF } from './utils/pdfExporter';
import { Download, AlertTriangle, RefreshCw, FileText, Sun, Moon } from 'lucide-react';

function App() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'dark';
  });

  useEffect(() => {
    if (theme === 'light') {
      document.body.classList.add('light-theme');
    } else {
      document.body.classList.remove('light-theme');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Data states
  const [resumeData, setResumeData] = useState(null);
  const [apiStatus, setApiStatus] = useState(null);
  const [durationMs, setDurationMs] = useState(0);
  const [rawPhotoUrls, setRawPhotoUrls] = useState(null);
  const [currentActor, setCurrentActor] = useState('');
  const [isExporting, setIsExporting] = useState(false);

  const handleSearch = async (actorName) => {
    setIsLoading(true);
    setError(null);
    setResumeData(null);
    setApiStatus(null);
    setRawPhotoUrls(null);
    setCurrentActor(actorName);
    
    try {
      const searchResponse = await runOrchestrator(actorName);
      
      setApiStatus(searchResponse.apiStatus);
      setRawPhotoUrls(searchResponse.photoUrls);
      
      // Check if at least Wikipedia succeeded, since it's the primary biographical source
      if (!searchResponse.apiStatus.wikipedia) {
        console.warn('Wikipedia fetch failed. Continuing but results may be limited.');
      }

      const structuredData = await formatWithGroq(searchResponse.rawPayload, actorName);
      
      // Inject JS-level meta statistics that the LLM cannot know
      const finalResumeData = {
        ...structuredData,
        meta: {
          query: actorName,
          generated_at: new Date().toLocaleString('en-IN'),
          response_time_ms: searchResponse.durationMs,
          sources_used: Object.keys(searchResponse.apiStatus).filter(k => searchResponse.apiStatus[k])
        }
      };

      setResumeData(finalResumeData);
      setDurationMs(searchResponse.durationMs);
      
    } catch (err) {
      console.error('App Search Flow Error:', err);
      setError(err.message || 'An unexpected error occurred during resume generation.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!currentActor) return;
    setIsExporting(true);
    try {
      await exportToPDF('resume-capture-node', currentActor);
    } catch (err) {
      alert(`Error generating PDF: ${err.message}`);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="app-container">
      {/* Header / Hero */}
      <header className="hero-section" style={{ position: 'relative' }}>
        <h1 className="logo-text">StarCV</h1>
        <p className="tagline">Search. Research. Resume.</p>
        <button 
          onClick={toggleTheme} 
          className="theme-toggle-btn"
          title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
        >
          {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
        </button>
      </header>

      {/* Autocomplete Search input */}
      <SearchBar onSearch={handleSearch} isLoading={isLoading} />

      {/* Instruction Tip */}
      {!isLoading && !resumeData && !error && (
        <div className="tip-alert">
          <p>
            Enter an Indian actor or actress name above to instantly generate their professional CV.
          </p>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="loading-wrapper">
          <div className="loader-spinner"></div>
          <p className="loading-text">Generating Resume...</p>
          <p className="loading-subtext">Searching and compiling profile details, please wait...</p>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div style={{ maxWidth: '600px', margin: '0 auto 2rem', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(239, 68, 68, 0.2)', backgroundColor: 'rgba(239, 68, 68, 0.05)', display: 'flex', alignItems: 'flex-start', gap: '1rem', boxSizing: 'border-box' }}>
          <AlertTriangle size={24} style={{ color: '#ef4444', flexShrink: 0, marginTop: '2px' }} />
          <div style={{ minWidth: 0, flex: 1 }}>
            <h3 style={{ color: '#f8fafc', fontWeight: 600, fontSize: '1.05rem', marginBottom: '4px' }}>Generation Failed</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.4', wordBreak: 'break-word', overflowWrap: 'break-word' }}>{error}</p>
            <button 
              onClick={() => handleSearch(currentActor)} 
              className="btn btn-primary" 
              style={{ marginTop: '12px', padding: '0.5rem 1rem', fontSize: '0.85rem' }}
            >
              <RefreshCw size={14} /> Retry Search
            </button>
          </div>
        </div>
      )}

      {/* Resume Card Layout Node */}
      {resumeData && !isLoading && (
        <Resume 
          data={resumeData} 
          rawPhotoUrls={rawPhotoUrls}
          apiStatus={apiStatus} 
          durationMs={durationMs}
          elementId="resume-capture-node" 
        />
      )}

      {/* Bottom Download Action Bar */}
      {resumeData && !isLoading && (
        <div className="action-buttons-bar" style={{ marginTop: '2.5rem', marginBottom: '1.5rem' }}>
          <button 
            className="btn btn-primary" 
            onClick={handleDownloadPDF} 
            disabled={isExporting}
          >
            {isExporting ? (
              <>
                <RefreshCw size={16} className="loader-spinner" style={{ width: '16px', height: '16px', borderTopColor: '#fff', margin: 0 }} />
                Compiling PDF...
              </>
            ) : (
              <>
                <Download size={16} />
                Download PDF Resume
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
