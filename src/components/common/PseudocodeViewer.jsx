import React from 'react';
import { Code2 } from 'lucide-react';

export function PseudocodeViewer({ pseudocode = [], activeLine = 0, algorithmName = '' }) {
  if (!pseudocode || pseudocode.length === 0) {
    return (
      <div className="pseudocode-empty">
        <Code2 size={16} />
        <span>Select an algorithm to view structured pseudocode.</span>
      </div>
    );
  }

  return (
    <div className="code-lines">
      {pseudocode.map((line, idx) => {
        const isHighlight = idx === activeLine;
        return (
          <div key={idx} className={`code-line ${isHighlight ? 'highlight' : ''}`}>
            <span className="line-no">{String(idx + 1).padStart(2, '0')}</span>
            <code>{line || ' '}</code>
            {isHighlight && <span className="line-caret">◂</span>}
          </div>
        );
      })}
    </div>
  );
}
