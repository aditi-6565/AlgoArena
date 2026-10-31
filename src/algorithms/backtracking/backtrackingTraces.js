// AlgoArena Backtracking Execution Trace Engine
// Generates decisions, candidate state branches, conflict detection, backtrack steps, and solution boards

export function generateBacktrackingTrace(algorithm, customParams = {}) {
  const steps = [];

  const pushStep = (description, details = {}) => {
    steps.push({
      line: description,
      board: details.board ? JSON.parse(JSON.stringify(details.board)) : null,
      row: details.row !== undefined ? details.row : null,
      col: details.col !== undefined ? details.col : null,
      val: details.val !== undefined ? details.val : null,
      activeCells: details.activeCells ? [...details.activeCells] : [],
      conflictCells: details.conflictCells ? [...details.conflictCells] : [],
      solutionCount: details.solutionCount || 0,
      kind: details.kind || 'explore',
      codeLine: details.codeLine || 0
    });
  };

  switch (algorithm) {
    case 'N-Queens': {
      const N = customParams.n || 4;
      const board = Array.from({ length: N }, () => new Array(N).fill(0));
      pushStep(`Starting ${N}-Queens Backtracking. Goal: Place ${N} non-attacking queens on an ${N}×${N} board.`, {
        board,
        kind: 'start',
        codeLine: 0
      });

      const cols = new Set();
      const posDiag = new Set(); // r + c
      const negDiag = new Set(); // r - c
      let solutions = 0;

      const solve = (r) => {
        if (r === N) {
          solutions++;
          pushStep(`FOUND VALID SOLUTION #${solutions}! All ${N} queens safely placed without mutual attacks.`, {
            board,
            solutionCount: solutions,
            kind: 'done',
            codeLine: 1
          });
          return true; // Stop at first solution for visualization clarity
        }

        for (let c = 0; c < N; c++) {
          const isConflict = cols.has(c) || posDiag.has(r + c) || negDiag.has(r - c);
          if (!isConflict) {
            // Place Queen
            board[r][c] = 1;
            cols.add(c);
            posDiag.add(r + c);
            negDiag.add(r - c);
            pushStep(`Row ${r}: Place queen safely at (${r}, ${c}). No column or diagonal conflicts.`, {
              board,
              row: r,
              col: c,
              activeCells: [[r, c]],
              kind: 'explore',
              codeLine: 4
            });

            if (solve(r + 1)) return true;

            // Backtrack
            board[r][c] = 0;
            cols.delete(c);
            posDiag.delete(r + c);
            negDiag.delete(r - c);
            pushStep(`Backtrack at Row ${r}: Remove queen from (${r}, ${c}). Exploring next column.`, {
              board,
              row: r,
              col: c,
              conflictCells: [[r, c]],
              kind: 'backtrack',
              codeLine: 6
            });
          } else {
            pushStep(`Cannot place queen at (${r}, ${c}): Conflicts with existing queen along column or diagonal.`, {
              board,
              row: r,
              col: c,
              conflictCells: [[r, c]],
              kind: 'conflict',
              codeLine: 3
            });
          }
        }
        return false;
      };

      solve(0);
      pushStep(`${N}-Queens search complete.`, { board, solutionCount: solutions, kind: 'done', codeLine: 7 });
      break;
    }

    case 'Rat in a Maze': {
      const maze = customParams.maze || [
        [1, 0, 0, 0],
        [1, 1, 0, 1],
        [0, 1, 0, 0],
        [1, 1, 1, 1]
      ];
      const N = maze.length;
      const pathBoard = Array.from({ length: N }, () => new Array(N).fill(0));

      pushStep(`Starting Rat in a Maze from (0, 0) to target (${N - 1}, ${N - 1}).`, {
        board: maze,
        kind: 'start',
        codeLine: 0
      });

      const isSafe = (r, c) => r >= 0 && r < N && c >= 0 && c < N && maze[r][c] === 1 && pathBoard[r][c] === 0;

      const solveMaze = (r, c) => {
        if (r === N - 1 && c === N - 1) {
          pathBoard[r][c] = 1;
          pushStep(`Destination (${N - 1}, ${N - 1}) reached! Valid escape path found.`, {
            board: pathBoard,
            activeCells: [[r, c]],
            kind: 'done',
            codeLine: 1
          });
          return true;
        }

        if (isSafe(r, c)) {
          pathBoard[r][c] = 1;
          pushStep(`Step into cell (${r}, ${c}). Exploring moves: Down, Right, Up, Left.`, {
            board: pathBoard,
            activeCells: [[r, c]],
            kind: 'explore',
            codeLine: 3
          });

          // Move Down
          if (solveMaze(r + 1, c)) return true;
          // Move Right
          if (solveMaze(r, c + 1)) return true;
          // Move Up
          if (solveMaze(r - 1, c)) return true;
          // Move Left
          if (solveMaze(r, c - 1)) return true;

          // Backtrack
          pathBoard[r][c] = 0;
          pushStep(`Backtracking from cell (${r}, ${c}): Dead end encountered. Retracting path.`, {
            board: pathBoard,
            conflictCells: [[r, c]],
            kind: 'backtrack',
            codeLine: 6
          });
          return false;
        }
        return false;
      };

      solveMaze(0, 0);
      pushStep('Maze navigation complete.', { board: pathBoard, kind: 'done', codeLine: 7 });
      break;
    }

    case 'Sudoku Solver': {
      // 4x4 Mini Sudoku for interactive clarity and fast step visualization
      const grid = customParams.grid || [
        [1, 0, 3, 0],
        [0, 4, 0, 2],
        [2, 0, 4, 0],
        [0, 3, 0, 1]
      ];
      const N = grid.length;
      const sub = Math.sqrt(N);
      const board = JSON.parse(JSON.stringify(grid));

      pushStep(`Starting ${N}×${N} Sudoku Solver using constraint satisfaction and backtracking.`, {
        board,
        kind: 'start',
        codeLine: 0
      });

      const isValid = (r, c, num) => {
        for (let i = 0; i < N; i++) {
          if (board[r][i] === num || board[i][c] === num) return false;
        }
        const startR = r - (r % sub);
        const startC = c - (c % sub);
        for (let i = 0; i < sub; i++) {
          for (let j = 0; j < sub; j++) {
            if (board[startR + i][startC + j] === num) return false;
          }
        }
        return true;
      };

      const solveSudoku = () => {
        for (let r = 0; r < N; r++) {
          for (let c = 0; c < N; c++) {
            if (board[r][c] === 0) {
              for (let num = 1; num <= N; num++) {
                if (isValid(r, c, num)) {
                  board[r][c] = num;
                  pushStep(`Cell (${r}, ${c}): Placed candidate ${num}. Constraints valid for row, col, and box.`, {
                    board,
                    row: r,
                    col: c,
                    val: num,
                    activeCells: [[r, c]],
                    kind: 'explore',
                    codeLine: 4
                  });

                  if (solveSudoku()) return true;

                  board[r][c] = 0;
                  pushStep(`Backtrack at (${r}, ${c}): Candidate ${num} caused conflict downstream. Reset cell to 0.`, {
                    board,
                    row: r,
                    col: c,
                    conflictCells: [[r, c]],
                    kind: 'backtrack',
                    codeLine: 6
                  });
                }
              }
              return false; // Trigger backtrack
            }
          }
        }
        return true;
      };

      const solved = solveSudoku();
      if (solved) {
        pushStep('Sudoku puzzle solved successfully!', { board, kind: 'done', codeLine: 7 });
      } else {
        pushStep('Sudoku puzzle is unsolvable or has conflicting initial configuration.', { board, kind: 'conflict', codeLine: 7 });
      }
      break;
    }

    default:
      pushStep(`Backtracking trace for ${algorithm} initialized.`, { kind: 'done' });
  }

  return steps;
}
