import React from 'react';

export function TableVisualizer({
  table = [],
  rowHeaders = [],
  colHeaders = [],
  activeCell = null,
  referencedCells = [],
  backtrackPath = [],
  recurrence = ''
}) {
  if (!table || table.length === 0) {
    return <div className="table-empty">Table not initialized.</div>;
  }

  const isCellActive = (r, c) => activeCell && activeCell[0] === r && activeCell[1] === c;
  const isCellReferenced = (r, c) => referencedCells.some(cell => cell[0] === r && cell[1] === c);
  const isCellBacktracked = (r, c) => backtrackPath.some(cell => cell[0] === r && cell[1] === c);

  return (
    <div className="dp-table-container">
      {recurrence && (
        <div className="recurrence-banner">
          <span className="banner-kicker">RECURRENCE:</span>
          <code>{recurrence}</code>
        </div>
      )}

      <div className="dp-table-scroll">
        <table className="dp-matrix-table">
          <thead>
            <tr>
              <th className="corner-header">State</th>
              {colHeaders.map((col, cIdx) => (
                <th key={cIdx} className="col-header">{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.map((row, rIdx) => (
              <tr key={rIdx}>
                <th className="row-header">
                  {rowHeaders[rIdx] || `[${rIdx}]`}
                </th>
                {row.map((val, cIdx) => {
                  const active = isCellActive(rIdx, cIdx);
                  const referenced = isCellReferenced(rIdx, cIdx);
                  const backtracked = isCellBacktracked(rIdx, cIdx);

                  let cellClass = 'dp-cell';
                  if (active) cellClass += ' active-cell';
                  else if (backtracked) cellClass += ' backtracked-cell';
                  else if (referenced) cellClass += ' referenced-cell';

                  return (
                    <td key={cIdx} className={cellClass}>
                      <span>{val !== undefined && val !== null ? val : '—'}</span>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="table-legend">
        <span><i className="legend-dot active-dot" /> Computing Cell</span>
        <span><i className="legend-dot compare-dot" /> Referenced Subproblems</span>
        <span><i className="legend-dot done-dot" /> Backtracked Optimal Solution</span>
      </div>
    </div>
  );
}
