import React from 'react';
import { Bookmark, Clock, Trophy, RotateCcw, Trash2, ArrowRight } from 'lucide-react';
import { resetProgress } from '../../core/storage/progressStorage.js';

export function ProgressModule({ progress, onSelectAlgorithm, onRefresh }) {
  const bookmarks = progress.bookmarked || [];
  const recents = progress.recentAlgorithms || [];
  const quizHistory = progress.quizHistory || [];

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset your local progress, history, and bookmarks?')) {
      resetProgress();
      if (onRefresh) onRefresh();
    }
  };

  return (
    <div className="progress-module-view">
      <div className="panel" style={{ padding: '20px', marginBottom: '16px' }}>
        <div className="panel-head">
          <div>
            <span className="section-kicker">PERSISTENT STORAGE</span>
            <h2>Learning Progress & Activity Log</h2>
          </div>
          <button className="reset-btn text-orange" onClick={handleReset}>
            <Trash2 size={14} /> Reset All Local Data
          </button>
        </div>
        <p style={{ fontSize: '11px', color: '#687066' }}>
          AlgoArena preserves your learning history, bookmarked algorithms, and quiz assessments in local storage. All features run 100% in-browser without external tracking or accounts.
        </p>
      </div>

      <div className="progress-grid-cols">
        {/* Bookmarked Algorithms */}
        <div className="panel" style={{ padding: '18px' }}>
          <div className="panel-head">
            <div>
              <span className="section-kicker"><Bookmark size={12} /> BOOKMARKS</span>
              <h3>Saved Algorithms</h3>
            </div>
            <span className="badge-count">{bookmarks.length}</span>
          </div>

          {bookmarks.length === 0 ? (
            <div className="empty-state-card">
              No bookmarks saved yet. Click the bookmark icon on any algorithm card to save it for quick review.
            </div>
          ) : (
            <div className="activity-list">
              {bookmarks.map(name => (
                <div key={name} className="activity-row" onClick={() => onSelectAlgorithm(name)}>
                  <strong>{name}</strong>
                  <ArrowRight size={14} className="row-arrow" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recently Explored */}
        <div className="panel" style={{ padding: '18px' }}>
          <div className="panel-head">
            <div>
              <span className="section-kicker"><Clock size={12} /> HISTORY</span>
              <h3>Recently Explored</h3>
            </div>
            <span className="badge-count">{recents.length}</span>
          </div>

          {recents.length === 0 ? (
            <div className="empty-state-card">No recent algorithm activity recorded.</div>
          ) : (
            <div className="activity-list">
              {recents.map((name, i) => (
                <div key={`${name}-${i}`} className="activity-row" onClick={() => onSelectAlgorithm(name)}>
                  <span>{name}</span>
                  <ArrowRight size={14} className="row-arrow" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quiz Performance History */}
        <div className="panel" style={{ padding: '18px', gridColumn: 'span 2' }}>
          <div className="panel-head">
            <div>
              <span className="section-kicker"><Trophy size={12} /> ASSESSMENT HISTORY</span>
              <h3>Quiz Performance Records</h3>
            </div>
            <span className="badge-count">{quizHistory.length} Sessions</span>
          </div>

          {quizHistory.length === 0 ? (
            <div className="empty-state-card">
              No quiz sessions completed yet. Head to Practice & Quizzes to test your DSA knowledge!
            </div>
          ) : (
            <div className="quiz-history-table">
              <table>
                <thead>
                  <tr>
                    <th>Topic</th>
                    <th>Score</th>
                    <th>Percentage</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {quizHistory.map((q, idx) => (
                    <tr key={idx}>
                      <td><b>{q.topic}</b></td>
                      <td>{q.score} / {q.total}</td>
                      <td>
                        <span className={`score-badge ${q.percentage >= 70 ? 'high' : 'medium'}`}>
                          {q.percentage}%
                        </span>
                      </td>
                      <td><small>{new Date(q.timestamp).toLocaleDateString()}</small></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
