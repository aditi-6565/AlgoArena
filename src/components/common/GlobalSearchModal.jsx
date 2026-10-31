import React, { useState, useEffect } from 'react';
import { Search, X, ArrowRight, BookOpen, Layers3, Network, Zap } from 'lucide-react';
import { ALGORITHMS_DATA, ALGORITHM_FAMILIES } from '../../data/algorithms.js';

export function GlobalSearchModal({ isOpen, onClose, onSelect }) {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else onSelect('__TOGGLE_SEARCH__');
      }
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, onSelect]);

  if (!isOpen) return null;

  const results = Object.values(ALGORITHMS_DATA).filter(item => {
    const q = query.toLowerCase().trim();
    if (!q) return true;
    return (
      item.name.toLowerCase().includes(q) ||
      item.family.toLowerCase().includes(q) ||
      (item.description && item.description.toLowerCase().includes(q))
    );
  }).slice(0, 10);

  return (
    <div className="search-modal-backdrop" onClick={onClose}>
      <div className="search-modal-content" onClick={e => e.stopPropagation()}>
        <div className="search-modal-header">
          <Search size={18} className="search-icon-muted" />
          <input
            autoFocus
            type="text"
            className="search-input-field"
            placeholder="Search algorithms, data structures, concepts... (e.g. Dijkstra, AVL, DP, Quick Sort)"
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
          <button className="icon-btn" onClick={onClose} title="Close search">
            <X size={16} />
          </button>
        </div>

        <div className="search-modal-results">
          {results.length === 0 ? (
            <div className="search-empty">No algorithms or data structures found matching "{query}".</div>
          ) : (
            results.map(item => (
              <div
                key={item.name}
                className="search-result-item"
                onClick={() => {
                  onSelect(item.name, item.family);
                  onClose();
                }}
              >
                <div className="result-left">
                  <span className="result-family-badge">{item.family}</span>
                  <strong>{item.name}</strong>
                  <small>{item.description}</small>
                </div>
                <div className="result-right">
                  <span className="complexity-badge-mini">
                    {item.timeAvg || item.time || item.timeSearch || 'O(1)'}
                  </span>
                  <ArrowRight size={14} className="result-arrow" />
                </div>
              </div>
            ))
          )}
        </div>
        <div className="search-modal-footer">
          <span><kbd>ESC</kbd> to close</span>
          <span><kbd>↑</kbd> <kbd>↓</kbd> to navigate</span>
          <span><kbd>ENTER</kbd> to select</span>
        </div>
      </div>
    </div>
  );
}
