import React from 'react';

export function ArrayVisualizer({ step, maxVal, compact = false, showPointers = false }) {
  const arr = step.array || [];
  const active = step.active || [];
  const compared = step.compared || [];
  const swapped = step.swapped || [];
  const sorted = step.sorted || [];
  const isDone = step.kind === 'done';

  const low = step.low;
  const mid = step.mid;
  const high = step.high;

  const effectiveMax = Math.max(1, maxVal || Math.max(...arr, 1));

  return (
    <div className={`array-canvas ${compact ? 'compact' : ''}`}>
      <div className="array-bars">
        {arr.map((val, idx) => {
          let barClass = '';
          if (active.includes(idx)) barClass = 'active';
          else if (compared.includes(idx)) barClass = 'compared';
          else if (swapped.includes(idx)) barClass = 'swapped';
          else if (sorted.includes(idx) || isDone) barClass = 'done';

          // Search range indicator
          const inRange = low !== undefined && high !== undefined && idx >= low && idx <= high;

          const heightPercent = Math.max(12, Math.min(100, Math.round((Math.abs(val) / effectiveMax) * 100)));

          return (
            <div
              className={`bar-column ${inRange ? 'in-search-range' : ''}`}
              key={idx}
            >
              {showPointers && (
                <div className="pointer-indicators">
                  {idx === low && <span className="pointer-tag low-tag">L</span>}
                  {idx === mid && <span className="pointer-tag mid-tag">M</span>}
                  {idx === high && <span className="pointer-tag high-tag">H</span>}
                </div>
              )}
              <div className={`bar-value ${barClass}`}>{val}</div>
              <div
                className={`bar ${barClass}`}
                style={{ height: `${heightPercent}%` }}
              />
              <span className="bar-index">{idx}</span>
            </div>
          );
        })}
      </div>
      <div className="array-axis">
        <span>INDEX (0-BASED)</span>
        <span>{arr.length} ELEMENTS</span>
      </div>
    </div>
  );
}
