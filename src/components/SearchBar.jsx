import React, { useState, useEffect, useRef } from 'react';
import { Search } from 'lucide-react';
import { POPULAR_ACTORS } from '../constants/actors';

export function SearchBar({ onSearch, isLoading }) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed) {
      setSuggestions([]);
      return;
    }

    // 1. Get local database matches immediately
    const localMatches = POPULAR_ACTORS.filter(actor =>
      actor.toLowerCase().includes(trimmed.toLowerCase())
    );

    setSuggestions(localMatches.slice(0, 5));

    // 2. Query Wikipedia OpenSearch dynamically (debounced to avoid spamming API)
    const delayDebounceId = setTimeout(async () => {
      try {
        const searchUrl = `https://en.wikipedia.org/w/api.php?action=opensearch&search=${encodeURIComponent(trimmed)}&limit=6&namespace=0&format=json&origin=*`;
        const response = await fetch(searchUrl);
        if (!response.ok) return;
        const data = await response.json();
        const wikiTitles = data[1] || [];

        // Merge local matches and Wikipedia results (removing duplicates case-insensitively)
        const combined = [...localMatches];
        wikiTitles.forEach(title => {
          // Filter out generic disambiguation lists if they contain words like "disambiguation"
          if (title.toLowerCase().includes('disambiguation')) return;
          
          if (!combined.some(item => item.toLowerCase() === title.toLowerCase())) {
            combined.push(title);
          }
        });

        setSuggestions(combined.slice(0, 5));
      } catch (err) {
        console.error('Wikipedia opensearch failed:', err);
      }
    }, 300);

    return () => clearTimeout(delayDebounceId);
  }, [query]);

  // Handle click outside suggestions container to close it
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex(prev => (prev + 1 < suggestions.length ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex(prev => (prev - 1 >= 0 ? prev - 1 : suggestions.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (activeIndex >= 0 && activeIndex < suggestions.length) {
        selectSuggestion(suggestions[activeIndex]);
      } else if (query.trim()) {
        triggerSearch(query.trim());
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const selectSuggestion = (val) => {
    setQuery(val);
    setIsOpen(false);
    triggerSearch(val);
  };

  const triggerSearch = (name) => {
    if (isLoading || !name.trim()) return;
    setIsOpen(false);
    onSearch(name);
  };

  return (
    <div className="search-wrapper" ref={dropdownRef}>
      <div className="search-input-container">
        <Search className="search-icon" size={20} />
        <input
          type="text"
          className="search-input"
          placeholder="Type an Indian actor's name (e.g. Rajinikanth, Ranbir Kapoor)..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
            setActiveIndex(-1);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
        />
      </div>

      {isOpen && suggestions.length > 0 && (
        <div className="suggestions-dropdown">
          {suggestions.map((item, idx) => (
            <div
              key={idx}
              className={`suggestion-item ${idx === activeIndex ? 'active' : ''}`}
              onClick={() => selectSuggestion(item)}
            >
              <span>{item}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
