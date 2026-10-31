// AlgoArena Dynamic Programming Execution Trace Engine
// Generates 2D/1D DP matrices with cell-by-cell formula updates, recurrence relations, and solution backtracking

export function generateDPTrace(algorithm, customParams = {}) {
  const steps = [];

  const pushStep = (description, details = {}) => {
    steps.push({
      line: description,
      table: details.table ? JSON.parse(JSON.stringify(details.table)) : null,
      rowHeaders: details.rowHeaders ? [...details.rowHeaders] : [],
      colHeaders: details.colHeaders ? [...details.colHeaders] : [],
      activeCell: details.activeCell || null, // [row, col]
      referencedCells: details.referencedCells ? [...details.referencedCells] : [],
      backtrackPath: details.backtrackPath ? [...details.backtrackPath] : [],
      recurrence: details.recurrence || '',
      result: details.result !== undefined ? details.result : null,
      kind: details.kind || 'compute',
      codeLine: details.codeLine || 0
    });
  };

  switch (algorithm) {
    case '0/1 Knapsack': {
      const W = customParams.capacity !== undefined ? customParams.capacity : 7;
      const wt = customParams.weights || [1, 3, 4, 5];
      const val = customParams.values || [1, 4, 5, 7];
      const n = wt.length;

      const rowHeaders = ['Base (0)', ...wt.map((w, i) => `Item ${i + 1} (w=${w}, v=${val[i]})`)];
      const colHeaders = Array.from({ length: W + 1 }, (_, w) => `w=${w}`);

      const dp = Array.from({ length: n + 1 }, () => new Array(W + 1).fill(0));
      pushStep(`Initialize (n+1)×(W+1) = ${n + 1}×${W + 1} DP table with 0s for base capacity 0 and 0 items.`, {
        table: dp,
        rowHeaders,
        colHeaders,
        recurrence: 'dp[i][w] = max(dp[i-1][w], val[i-1] + dp[i-1][w - wt[i-1]])',
        kind: 'start',
        codeLine: 1
      });

      for (let i = 1; i <= n; i++) {
        const itemW = wt[i - 1];
        const itemV = val[i - 1];
        for (let w = 0; w <= W; w++) {
          if (itemW <= w) {
            const excludeVal = dp[i - 1][w];
            const includeVal = itemV + dp[i - 1][w - itemW];
            dp[i][w] = Math.max(excludeVal, includeVal);
            pushStep(`Row ${i} (Item ${i}), Cap ${w}: max(exclude=${excludeVal}, include=${itemV}+dp[${i - 1}][${w - itemW}]=${includeVal}) = ${dp[i][w]}.`, {
              table: dp,
              rowHeaders,
              colHeaders,
              activeCell: [i, w],
              referencedCells: [[i - 1, w], [i - 1, w - itemW]],
              recurrence: `dp[${i}][${w}] = max(${excludeVal}, ${includeVal})`,
              kind: 'compute',
              codeLine: 4
            });
          } else {
            dp[i][w] = dp[i - 1][w];
            pushStep(`Row ${i} (Item ${i}), Cap ${w}: Item weight ${itemW} exceeds capacity ${w}; inherit dp[${i - 1}][${w}] = ${dp[i][w]}.`, {
              table: dp,
              rowHeaders,
              colHeaders,
              activeCell: [i, w],
              referencedCells: [[i - 1, w]],
              recurrence: `dp[${i}][${w}] = dp[${i - 1}][${w}]`,
              kind: 'compute',
              codeLine: 5
            });
          }
        }
      }

      // Backtrack solution items
      const selectedItems = [];
      const backtrackCells = [];
      let currW = W;
      for (let i = n; i > 0; i--) {
        backtrackCells.push([i, currW]);
        if (dp[i][currW] !== dp[i - 1][currW]) {
          selectedItems.push(`Item ${i} (wt=${wt[i - 1]}, val=${val[i - 1]})`);
          currW -= wt[i - 1];
        }
      }
      backtrackCells.push([0, currW]);

      pushStep(`Knapsack 0/1 complete! Maximum profit: ${dp[n][W]}. Selected items: [${selectedItems.reverse().join(', ')}].`, {
        table: dp,
        rowHeaders,
        colHeaders,
        activeCell: [n, W],
        backtrackPath: backtrackCells,
        result: dp[n][W],
        kind: 'done',
        codeLine: 6
      });
      break;
    }

    case 'Longest Common Subsequence': {
      const s1 = customParams.str1 || 'LONGEST';
      const s2 = customParams.str2 || 'STONE';
      const m = s1.length;
      const n = s2.length;

      const rowHeaders = ['Ø', ...s1.split('')];
      const colHeaders = ['Ø', ...s2.split('')];
      const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));

      pushStep(`Initialize (${m + 1})×(${n + 1}) LCS table. Compare '${s1}' with '${s2}'.`, {
        table: dp,
        rowHeaders,
        colHeaders,
        recurrence: 'if s1[i-1] == s2[j-1]: dp[i-1][j-1]+1 else: max(dp[i-1][j], dp[i][j-1])',
        kind: 'start',
        codeLine: 1
      });

      for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
          if (s1[i - 1] === s2[j - 1]) {
            dp[i][j] = dp[i - 1][j - 1] + 1;
            pushStep(`Match '${s1[i - 1]}' == '${s2[j - 1]}': dp[${i}][${j}] = dp[${i - 1}][${j - 1}] + 1 = ${dp[i][j]}.`, {
              table: dp,
              rowHeaders,
              colHeaders,
              activeCell: [i, j],
              referencedCells: [[i - 1, j - 1]],
              recurrence: `dp[${i}][${j}] = dp[${i - 1}][${j - 1}] + 1`,
              kind: 'compute',
              codeLine: 4
            });
          } else {
            dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
            pushStep(`Mismatch '${s1[i - 1]}' != '${s2[j - 1]}': max(up=${dp[i - 1][j]}, left=${dp[i][j - 1]}) = ${dp[i][j]}.`, {
              table: dp,
              rowHeaders,
              colHeaders,
              activeCell: [i, j],
              referencedCells: [[i - 1, j], [i, j - 1]],
              recurrence: `dp[${i}][${j}] = max(${dp[i - 1][j]}, ${dp[i][j - 1]})`,
              kind: 'compute',
              codeLine: 5
            });
          }
        }
      }

      // Backtrack LCS String
      let lcsStr = '';
      const backtrackCells = [];
      let r = m, c = n;
      while (r > 0 && c > 0) {
        backtrackCells.push([r, c]);
        if (s1[r - 1] === s2[c - 1]) {
          lcsStr = s1[r - 1] + lcsStr;
          r--; c--;
        } else if (dp[r - 1][c] >= dp[r][c - 1]) {
          r--;
        } else {
          c--;
        }
      }
      backtrackCells.push([r, c]);

      pushStep(`LCS complete. Length: ${dp[m][n]}, Subsequence: "${lcsStr}".`, {
        table: dp,
        rowHeaders,
        colHeaders,
        activeCell: [m, n],
        backtrackPath: backtrackCells,
        result: lcsStr,
        kind: 'done',
        codeLine: 6
      });
      break;
    }

    case 'Coin Change DP': {
      const coins = customParams.coins || [1, 2, 5];
      const amount = customParams.amount !== undefined ? customParams.amount : 11;

      const dp = new Array(amount + 1).fill(Infinity);
      dp[0] = 0;

      const table = [dp.map(v => (v === Infinity ? '∞' : v))];
      const rowHeaders = ['Min Coins'];
      const colHeaders = Array.from({ length: amount + 1 }, (_, i) => `¢${i}`);

      pushStep(`Starting Coin Change DP for amount ${amount} with coins [${coins.join(', ')}]. Base case dp[0] = 0.`, {
        table,
        rowHeaders,
        colHeaders,
        recurrence: 'dp[i] = min(dp[i], dp[i - coin] + 1)',
        kind: 'start',
        codeLine: 1
      });

      for (let i = 1; i <= amount; i++) {
        for (let c of coins) {
          if (i >= c && dp[i - c] !== Infinity) {
            if (dp[i - c] + 1 < dp[i]) {
              dp[i] = dp[i - c] + 1;
              const currentTable = [dp.map(v => (v === Infinity ? '∞' : v))];
              pushStep(`Amount ${i}: using coin ${c} gives 1 + dp[${i - c}] = ${dp[i]} coin(s).`, {
                table: currentTable,
                rowHeaders,
                colHeaders,
                activeCell: [0, i],
                referencedCells: [[0, i - c]],
                recurrence: `dp[${i}] = min(dp[${i}], dp[${i - c}] + 1) = ${dp[i]}`,
                kind: 'compute',
                codeLine: 4
              });
            }
          }
        }
      }

      const finalTable = [dp.map(v => (v === Infinity ? '∞' : v))];
      pushStep(`Coin Change DP complete. Minimum coins needed for ${amount}: ${dp[amount]}.`, {
        table: finalTable,
        rowHeaders,
        colHeaders,
        activeCell: [0, amount],
        result: dp[amount],
        kind: 'done',
        codeLine: 5
      });
      break;
    }

    case 'Edit Distance': {
      const w1 = customParams.word1 || 'HORSE';
      const w2 = customParams.word2 || 'ROS';
      const m = w1.length;
      const n = w2.length;

      const rowHeaders = ['Ø', ...w1.split('')];
      const colHeaders = ['Ø', ...w2.split('')];
      const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));

      for (let i = 0; i <= m; i++) dp[i][0] = i;
      for (let j = 0; j <= n; j++) dp[0][j] = j;

      pushStep(`Initialize (${m + 1})×(${n + 1}) Edit Distance matrix. Base cases initialized for empty string insertions/deletions.`, {
        table: dp,
        rowHeaders,
        colHeaders,
        recurrence: 'if w1[i-1] == w2[j-1]: dp[i-1][j-1] else: 1 + min(insert, delete, replace)',
        kind: 'start',
        codeLine: 2
      });

      for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
          if (w1[i - 1] === w2[j - 1]) {
            dp[i][j] = dp[i - 1][j - 1];
            pushStep(`Characters match '${w1[i - 1]}': No edit needed; inherit diagonal dp[${i - 1}][${j - 1}] = ${dp[i][j]}.`, {
              table: dp,
              rowHeaders,
              colHeaders,
              activeCell: [i, j],
              referencedCells: [[i - 1, j - 1]],
              recurrence: `dp[${i}][${j}] = dp[${i - 1}][${j - 1}]`,
              kind: 'compute',
              codeLine: 4
            });
          } else {
            const insertCost = dp[i][j - 1];
            const deleteCost = dp[i - 1][j];
            const replaceCost = dp[i - 1][j - 1];
            dp[i][j] = 1 + Math.min(insertCost, deleteCost, replaceCost);
            pushStep(`Mismatch '${w1[i - 1]}' != '${w2[j - 1]}': 1 + min(ins=${insertCost}, del=${deleteCost}, rep=${replaceCost}) = ${dp[i][j]}.`, {
              table: dp,
              rowHeaders,
              colHeaders,
              activeCell: [i, j],
              referencedCells: [[i, j - 1], [i - 1, j], [i - 1, j - 1]],
              recurrence: `dp[${i}][${j}] = 1 + min(${insertCost}, ${deleteCost}, ${replaceCost})`,
              kind: 'compute',
              codeLine: 5
            });
          }
        }
      }

      pushStep(`Edit Distance calculation complete: ${dp[m][n]} edits needed to convert '${w1}' to '${w2}'.`, {
        table: dp,
        rowHeaders,
        colHeaders,
        activeCell: [m, n],
        result: dp[m][n],
        kind: 'done',
        codeLine: 6
      });
      break;
    }

    case 'Minimum Path Sum': {
      const grid = customParams.grid || [
        [1, 3, 1],
        [1, 5, 1],
        [4, 2, 1]
      ];
      const m = grid.length;
      const n = grid[0].length;

      const dp = Array.from({ length: m }, () => new Array(n).fill(0));
      dp[0][0] = grid[0][0];

      const rowHeaders = Array.from({ length: m }, (_, r) => `Row ${r}`);
      const colHeaders = Array.from({ length: n }, (_, c) => `Col ${c}`);

      pushStep(`Initialize grid path sum DP. Start at (0,0) with cost ${dp[0][0]}.`, {
        table: dp,
        rowHeaders,
        colHeaders,
        activeCell: [0, 0],
        recurrence: 'dp[r][c] = grid[r][c] + min(dp[r-1][c], dp[r][c-1])',
        kind: 'start',
        codeLine: 1
      });

      // Fill first col
      for (let r = 1; r < m; r++) {
        dp[r][0] = dp[r - 1][0] + grid[r][0];
        pushStep(`First column: can only move down. dp[${r}][0] = ${dp[r][0]}.`, {
          table: dp,
          rowHeaders,
          colHeaders,
          activeCell: [r, 0],
          referencedCells: [[r - 1, 0]],
          kind: 'compute',
          codeLine: 3
        });
      }

      // Fill first row
      for (let c = 1; c < n; c++) {
        dp[0][c] = dp[0][c - 1] + grid[0][c];
        pushStep(`First row: can only move right. dp[0][${c}] = ${dp[0][c]}.`, {
          table: dp,
          rowHeaders,
          colHeaders,
          activeCell: [0, c],
          referencedCells: [[0, c - 1]],
          kind: 'compute',
          codeLine: 2
        });
      }

      // Fill remaining cells
      for (let r = 1; r < m; r++) {
        for (let c = 1; c < n; c++) {
          const fromTop = dp[r - 1][c];
          const fromLeft = dp[r][c - 1];
          dp[r][c] = grid[r][c] + Math.min(fromTop, fromLeft);
          pushStep(`Cell (${r}, ${c}): grid val ${grid[r][c]} + min(top=${fromTop}, left=${fromLeft}) = ${dp[r][c]}.`, {
            table: dp,
            rowHeaders,
            colHeaders,
            activeCell: [r, c],
            referencedCells: [[r - 1, c], [r, c - 1]],
            recurrence: `dp[${r}][${c}] = ${grid[r][c]} + min(${fromTop}, ${fromLeft}) = ${dp[r][c]}`,
            kind: 'compute',
            codeLine: 5
          });
        }
      }

      // Backtrack optimal path
      const path = [];
      let currR = m - 1;
      let currC = n - 1;
      while (currR > 0 || currC > 0) {
        path.push([currR, currC]);
        if (currR === 0) currC--;
        else if (currC === 0) currR--;
        else if (dp[currR - 1][currC] < dp[currR][currC - 1]) currR--;
        else currC--;
      }
      path.push([0, 0]);

      pushStep(`Minimum Path Sum complete! Minimum total path cost: ${dp[m - 1][n - 1]}.`, {
        table: dp,
        rowHeaders,
        colHeaders,
        activeCell: [m - 1, n - 1],
        backtrackPath: path,
        result: dp[m - 1][n - 1],
        kind: 'done',
        codeLine: 6
      });
      break;
    }

    default: {
      // Generic fallback for other DP algorithms (Fibonacci, Rod Cutting, Subset Sum, LIS, Matrix Chain, TSP)
      const n = 5;
      const dp = [1, 1, 2, 3, 5, 8];
      pushStep(`Dynamic Programming trace for ${algorithm} initialized.`, {
        table: [dp],
        rowHeaders: ['State'],
        colHeaders: ['0', '1', '2', '3', '4', '5'],
        result: dp[dp.length - 1],
        kind: 'done',
        codeLine: 0
      });
    }
  }

  return steps;
}
