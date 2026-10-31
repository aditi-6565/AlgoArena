import React, { useState } from 'react';
import { CircleHelp, CheckCircle2, AlertTriangle, Layers, ChevronDown, ChevronUp } from 'lucide-react';

export function ComplexityCard({ data }) {
  const [expanded, setExpanded] = useState(false);

  if (!data) return null;

  return (
    <div className="algorithm-note-card">
      <div className="note-card-header">
        <div className="note-icon-wrap">
          <CircleHelp size={17} />
        </div>
        <div>
          <strong>{data.name}</strong>
          <p>{data.description}</p>
        </div>
      </div>

      <div className="complexity-grid-pills">
        <div className="pill-item">
          <small>TIME (AVG)</small>
          <strong>{data.timeAvg || data.time || data.timeSearch || 'O(n)'}</strong>
        </div>
        <div className="pill-item">
          <small>TIME (WORST)</small>
          <strong>{data.timeWorst || data.time || 'O(n)'}</strong>
        </div>
        <div className="pill-item">
          <small>SPACE</small>
          <strong>{data.space || 'O(1)'}</strong>
        </div>
        {data.stable !== undefined && (
          <div className="pill-item">
            <small>STABILITY</small>
            <strong className={data.stable ? 'text-green' : 'text-orange'}>
              {data.stable ? 'Stable' : 'Unstable'}
            </strong>
          </div>
        )}
      </div>

      {data.principle && (
        <div className="principle-box">
          <span className="principle-label">CORE PRINCIPLE:</span>
          <span>{data.principle}</span>
        </div>
      )}

      {(data.pros || data.cons || data.applications) && (
        <div className="deep-dive-section">
          <button className="expand-details-btn" onClick={() => setExpanded(!expanded)}>
            <span>Academic Deep Dive & Real-World Use</span>
            {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>

          {expanded && (
            <div className="deep-dive-content">
              {data.pros && (
                <div className="pros-block">
                  <div className="block-title text-green"><CheckCircle2 size={13} /> Key Advantages</div>
                  <ul>{data.pros.map((p, i) => <li key={i}>{p}</li>)}</ul>
                </div>
              )}
              {data.cons && (
                <div className="cons-block">
                  <div className="block-title text-orange"><AlertTriangle size={13} /> Trade-offs & Limitations</div>
                  <ul>{data.cons.map((c, i) => <li key={i}>{c}</li>)}</ul>
                </div>
              )}
              {data.applications && (
                <div className="apps-block">
                  <div className="block-title text-blue"><Layers size={13} /> Real-World Applications</div>
                  <ul>{data.applications.map((a, i) => <li key={i}>{a}</li>)}</ul>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
