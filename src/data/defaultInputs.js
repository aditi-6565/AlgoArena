// AlgoArena Default Datasets & Samples

export const SAMPLE_ARRAYS = {
  random: [38, 12, 27, 43, 9, 31, 18, 25],
  nearlySorted: [5, 8, 12, 19, 15, 23, 28, 32],
  reversed: [50, 42, 35, 28, 20, 14, 9, 3],
  duplicates: [14, 25, 14, 8, 30, 25, 8, 19],
  small: [7, 2, 9, 1, 5],
  countingSortSample: [4, 2, 8, 3, 3, 1, 4, 7, 2, 5],
  radixSortSample: [170, 45, 75, 90, 802, 24, 2, 66],
};

export const SAMPLE_GRAPHS = {
  simple: {
    directed: false,
    vertices: ['A', 'B', 'C', 'D', 'E', 'F'],
    edges: [
      { from: 'A', to: 'B', weight: 4 },
      { from: 'A', to: 'C', weight: 2 },
      { from: 'B', to: 'D', weight: 5 },
      { from: 'B', to: 'E', weight: 1 },
      { from: 'C', to: 'F', weight: 8 },
      { from: 'E', to: 'F', weight: 3 },
    ],
    positions: {
      A: { x: 80, y: 120 },
      B: { x: 200, y: 60 },
      C: { x: 200, y: 190 },
      D: { x: 340, y: 50 },
      E: { x: 320, y: 120 },
      F: { x: 360, y: 200 },
    }
  },
  dag: {
    directed: true,
    vertices: ['5', '0', '4', '1', '2', '3'],
    edges: [
      { from: '5', to: '2', weight: 1 },
      { from: '5', to: '0', weight: 1 },
      { from: '4', to: '0', weight: 1 },
      { from: '4', to: '1', weight: 1 },
      { from: '2', to: '3', weight: 1 },
      { from: '3', to: '1', weight: 1 },
    ],
    positions: {
      '5': { x: 80, y: 70 },
      '4': { x: 80, y: 170 },
      '2': { x: 220, y: 70 },
      '0': { x: 220, y: 170 },
      '3': { x: 350, y: 70 },
      '1': { x: 350, y: 170 },
    }
  },
  negativeWeights: {
    directed: true,
    vertices: ['S', 'A', 'B', 'C', 'D'],
    edges: [
      { from: 'S', to: 'A', weight: 4 },
      { from: 'S', to: 'B', weight: 2 },
      { from: 'A', to: 'C', weight: 2 },
      { from: 'B', to: 'A', weight: 1 },
      { from: 'B', to: 'D', weight: 4 },
      { from: 'C', to: 'D', weight: -3 },
    ],
    positions: {
      S: { x: 70, y: 120 },
      A: { x: 190, y: 60 },
      B: { x: 190, y: 180 },
      C: { x: 330, y: 60 },
      D: { x: 330, y: 180 },
    }
  },
  bipartiteSample: {
    directed: false,
    vertices: ['1', '2', '3', '4'],
    edges: [
      { from: '1', to: '2', weight: 1 },
      { from: '2', to: '3', weight: 1 },
      { from: '3', to: '4', weight: 1 },
      { from: '4', to: '1', weight: 1 },
    ],
    positions: {
      '1': { x: 120, y: 70 },
      '2': { x: 300, y: 70 },
      '3': { x: 300, y: 190 },
      '4': { x: 120, y: 190 },
    }
  }
};

export const SAMPLE_DP = {
  knapsack: {
    capacity: 7,
    weights: [1, 3, 4, 5],
    values: [1, 4, 5, 7],
    names: ['Item 1', 'Item 2', 'Item 3', 'Item 4']
  },
  lcs: {
    str1: 'LONGEST',
    str2: 'STONE'
  },
  coinChange: {
    coins: [1, 2, 5],
    amount: 11
  },
  matrixChain: {
    dims: [10, 20, 30, 40, 30]
  },
  tspMatrix: [
    [0, 10, 15, 20],
    [10, 0, 35, 25],
    [15, 35, 0, 30],
    [20, 25, 30, 0]
  ]
};

export const SAMPLE_BACKTRACKING = {
  nQueensDefault: 4,
  maze: [
    [1, 0, 0, 0],
    [1, 1, 0, 1],
    [0, 1, 0, 0],
    [1, 1, 1, 1]
  ],
  miniSudoku: [
    [1, 0, 3, 0],
    [0, 4, 0, 2],
    [2, 0, 4, 0],
    [0, 3, 0, 1]
  ]
};
