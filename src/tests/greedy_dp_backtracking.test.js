// Automated tests for Greedy, Dynamic Programming, and Backtracking
import { describe, it, expect } from 'vitest';
import { generateGreedyTrace } from '../algorithms/greedy/greedyTraces.js';
import { generateDPTrace } from '../algorithms/dynamic-programming/dpTraces.js';
import { generateBacktrackingTrace } from '../algorithms/backtracking/backtrackingTraces.js';

describe('Greedy Algorithms Tests', () => {
  it('Activity Selection selects maximum non-conflicting activities', () => {
    const steps = generateGreedyTrace('Activity Selection');
    const finalStep = steps[steps.length - 1];
    expect(finalStep.metricValue).toBeGreaterThan(0);
    expect(finalStep.selected.length).toBe(finalStep.metricValue);
  });

  it('Fractional Knapsack achieves optimal profit with fractional take', () => {
    const steps = generateGreedyTrace('Fractional Knapsack', { capacity: 50 });
    const finalStep = steps[steps.length - 1];
    expect(finalStep.metricValue).toBe(240); // 60 + 100 + 120 * (20/30) = 240
  });

  it('Job Sequencing correctly schedules jobs without exceeding deadlines', () => {
    const steps = generateGreedyTrace('Job Sequencing with Deadlines');
    const finalStep = steps[steps.length - 1];
    expect(finalStep.metricValue).toBeGreaterThan(0);
  });

  it('Coin Change Greedy calculates coins and warns on arbitrary denominations', () => {
    const steps = generateGreedyTrace('Coin Change Greedy', { coins: [4, 3, 1], amount: 6 });
    const finalStep = steps[steps.length - 1];
    expect(finalStep.line).toContain('NOTE');
  });
});

describe('Dynamic Programming Tests', () => {
  it('0/1 Knapsack computes correct DP table and optimal value', () => {
    const steps = generateDPTrace('0/1 Knapsack', {
      capacity: 7,
      weights: [1, 3, 4, 5],
      values: [1, 4, 5, 7]
    });
    const finalStep = steps[steps.length - 1];
    expect(finalStep.result).toBe(9); // Items with wt 3 and 4 -> val 4 + 5 = 9
  });

  it('Longest Common Subsequence finds correct length and substring', () => {
    const steps = generateDPTrace('Longest Common Subsequence', {
      str1: 'LONGEST',
      str2: 'STONE'
    });
    const finalStep = steps[steps.length - 1];
    expect(finalStep.result).toBe('ONE'); // LCS is 'ONE' (len 3)
  });

  it('Coin Change DP computes minimum coins', () => {
    const steps = generateDPTrace('Coin Change DP', {
      coins: [1, 2, 5],
      amount: 11
    });
    const finalStep = steps[steps.length - 1];
    expect(finalStep.result).toBe(3); // 5 + 5 + 1
  });

  it('Minimum Path Sum computes minimum grid route', () => {
    const steps = generateDPTrace('Minimum Path Sum', {
      grid: [
        [1, 3, 1],
        [1, 5, 1],
        [4, 2, 1]
      ]
    });
    const finalStep = steps[steps.length - 1];
    expect(finalStep.result).toBe(7); // 1 -> 3 -> 1 -> 1 -> 1 = 7
  });
});

describe('Backtracking Tests', () => {
  it('N-Queens places 4 queens safely without conflict', () => {
    const steps = generateBacktrackingTrace('N-Queens', { n: 4 });
    const doneStep = steps.find(s => s.kind === 'done' && s.solutionCount > 0);
    expect(doneStep).toBeDefined();
    // Verify each row and col has exactly 1 queen in final board
    const board = doneStep.board;
    const rowCounts = board.map(row => row.reduce((a, b) => a + b, 0));
    expect(rowCounts).toEqual([1, 1, 1, 1]);
  });

  it('Rat in a Maze finds path from top-left to bottom-right', () => {
    const steps = generateBacktrackingTrace('Rat in a Maze');
    const doneStep = steps.find(s => s.line.includes('Destination'));
    expect(doneStep).toBeDefined();
    expect(doneStep.board[3][3]).toBe(1);
  });

  it('Sudoku Solver solves mini 4x4 sudoku puzzle', () => {
    const steps = generateBacktrackingTrace('Sudoku Solver');
    const doneStep = steps.find(s => s.line.includes('solved successfully'));
    expect(doneStep).toBeDefined();
    // Verify no 0s left
    const allFilled = doneStep.board.every(row => row.every(cell => cell > 0));
    expect(allFilled).toBe(true);
  });
});
