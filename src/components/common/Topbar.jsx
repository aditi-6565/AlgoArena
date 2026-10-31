import React from 'react';
import { Menu, Search, Bookmark, BookmarkCheck, Sparkles } from 'lucide-react';

export function Topbar({
  onOpenMenu,
  activeModule,
  activeAlgorithm,
  onOpenSearch,
  isBookmarked,
  onToggleBookmark
}) {
  return (
    <header className="topbar">
      <div className="topbar-left">
        <button className="icon-btn menu-button" onClick={onOpenMenu} title="Toggle Sidebar">
          <Menu size={19} />
        </button>
        <div className="crumb">
          Workspace <span>/</span>
          <b>{activeModule}</b>
          {activeAlgorithm && (
            <>
              <span>/</span>
              <span className="crumb-active">{activeAlgorithm}</span>
            </>
          )}
        </div>
      </div>

      <div className="top-actions">
        {activeAlgorithm && (
          <button
            className={`bookmark-btn ${isBookmarked ? 'active' : ''}`}
            onClick={onToggleBookmark}
            title={isBookmarked ? 'Remove Bookmark' : 'Bookmark this Algorithm'}
          >
            {isBookmarked ? <BookmarkCheck size={15} /> : <Bookmark size={15} />}
            <span>{isBookmarked ? 'Saved' : 'Bookmark'}</span>
          </button>
        )}

        <button className="search-trigger-btn" onClick={onOpenSearch} title="Search (Ctrl + K)">
          <Search size={14} />
          <span>Quick Search...</span>
          <kbd>Ctrl K</kbd>
        </button>

        <div className="status-pill">
          <span className="live-dot" /> Workbench Active
        </div>
        <div className="top-avatar">AA</div>
      </div>
    </header>
  );
}
