import React from 'react';

export function GridVisualizer({
  kind = 'queens', // 'queens', 'maze', 'sudoku'
  board = [],
  activeCells = [],
  conflictCells = []
}) {
  if (!board || board.length === 0) return null;

  const N = board.length;

  const isActive = (r, c) => activeCells.some(([ar, ac]) => ar === r && ac === c);
  const isConflict = (r, c) => conflictCells.some(([cr, cc]) => cr === r && cc === c);

  if (kind === 'queens') {
    return (
      <div className="queen-canvas">
        <div
          className="chessboard-dynamic"
          style={{ gridTemplateColumns: `repeat(${N}, 42px)`, gridTemplateRows: `repeat(${N}, 42px)` }}
        >
          {board.map((row, r) =>
            row.map((val, c) => {
              const isDark = (r + c) % 2 === 1;
              const hasQueen = val === 1;
              const active = isActive(r, c);
              const conflict = isConflict(r, c);

              let sqClass = `chess-sq ${isDark ? 'dark' : 'light'}`;
              if (active) sqClass += ' active-sq';
              if (conflict) sqClass += ' conflict-sq';

              return (
                <div key={`${r}-${c}`} className={sqClass}>
                  {hasQueen && <span className="queen-piece">♛</span>}
                  <span className="sq-coord">{r},{c}</span>
                </div>
              );
            })
          )}
        </div>
        <div className="queen-caption">
          N-Queens: ♛ must not share any row, column, or diagonal. Backtracks immediately upon conflict.
        </div>
      </div>
    );
  }

  if (kind === 'maze') {
    return (
      <div className="maze-canvas">
        <div
          className="maze-grid"
          style={{ gridTemplateColumns: `repeat(${N}, 48px)`, gridTemplateRows: `repeat(${N}, 48px)` }}
        >
          {board.map((row, r) =>
            row.map((val, c) => {
              const isWall = val === 0;
              const isStart = r === 0 && c === 0;
              const isDest = r === N - 1 && c === N - 1;
              const isPath = val === 1;
              const active = isActive(r, c);
              const conflict = isConflict(r, c);

              let cellClass = `maze-cell ${isWall ? 'wall' : 'corridor'}`;
              if (isPath) cellClass += ' in-path';
              if (active) cellClass += ' active-cell';
              if (conflict) cellClass += ' dead-end';

              return (
                <div key={`${r}-${c}`} className={cellClass}>
                  {isStart && <span className="maze-tag start-tag">START</span>}
                  {isDest && <span className="maze-tag dest-tag">GOAL</span>}
                  {isWall && <span className="wall-icon">█</span>}
                  {isPath && !isStart && !isDest && <span className="path-dot">●</span>}
                </div>
              );
            })
          )}
        </div>
        <div className="queen-caption">
          Rat in a Maze: Navigate from top-left (0,0) to goal (bottom-right) avoiding walls (█).
        </div>
      </div>
    );
  }

  if (kind === 'sudoku') {
    return (
      <div className="sudoku-canvas">
        <div
          className="sudoku-grid"
          style={{ gridTemplateColumns: `repeat(${N}, 44px)`, gridTemplateRows: `repeat(${N}, 44px)` }}
        >
          {board.map((row, r) =>
            row.map((val, c) => {
              const active = isActive(r, c);
              const conflict = isConflict(r, c);
              let cellClass = 'sudoku-cell';
              if (active) cellClass += ' active-sudoku';
              if (conflict) cellClass += ' conflict-sudoku';

              return (
                <div key={`${r}-${c}`} className={cellClass}>
                  <strong>{val > 0 ? val : ''}</strong>
                </div>
              );
            })
          )}
        </div>
        <div className="queen-caption">
          Sudoku: Backtracking constraint satisfaction ensuring distinct values across rows, cols, and subgrids.
        </div>
      </div>
    );
  }

  return null;
}
