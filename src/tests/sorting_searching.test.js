// Automated tests for Sorting & Searching Trace Engines
import { describe, it, expect } from 'vitest';
import { generateSortingTrace } from '../algorithms/sorting/sortingTraces.js';
import { generateSearchingTrace } from '../algorithms/searching/searchingTraces.js';

describe('Sorting Trace Generation', () => {
  const algorithms = [
    'Bubble Sort',
    'Selection Sort',
    'Insertion Sort',
    'Merge Sort',
    'Quick Sort',
    'Heap Sort',
    'Shell Sort'
  ];

  algorithms.forEach(algo => {
    describe(`${algo}`, () => {
      it('correctly sorts a random unsorted array', () => {
        const input = [38, 12, 27, 43, 9, 31, 18, 25];
        const steps = generateSortingTrace(input, algo);
        expect(steps.length).toBeGreaterThan(0);
        const finalStep = steps[steps.length - 1];
        expect(finalStep.array).toEqual([...input].sort((a, b) => a - b));
      });

      it('handles an already sorted array', () => {
        const input = [1, 2, 3, 4, 5];
        const steps = generateSortingTrace(input, algo);
        const finalStep = steps[steps.length - 1];
        expect(finalStep.array).toEqual([1, 2, 3, 4, 5]);
      });

      it('handles reverse-sorted array', () => {
        const input = [9, 7, 5, 3, 1];
        const steps = generateSortingTrace(input, algo);
        const finalStep = steps[steps.length - 1];
        expect(finalStep.array).toEqual([1, 3, 5, 7, 9]);
      });

      it('handles arrays with duplicates and negatives', () => {
        const input = [4, -2, 7, 4, -2, 0, 1];
        const steps = generateSortingTrace(input, algo);
        const finalStep = steps[steps.length - 1];
        expect(finalStep.array).toEqual([...input].sort((a, b) => a - b));
      });

      it('handles single element array', () => {
        const input = [42];
        const steps = generateSortingTrace(input, algo);
        expect(steps[steps.length - 1].array).toEqual([42]);
      });
    });
  });

  describe('Non-comparison sorts (Counting, Radix, Bucket)', () => {
    it('Counting Sort works on positive integer arrays with duplicates', () => {
      const input = [4, 2, 8, 3, 3, 1, 4, 7, 2, 5];
      const steps = generateSortingTrace(input, 'Counting Sort');
      expect(steps[steps.length - 1].array).toEqual([...input].sort((a, b) => a - b));
    });

    it('Radix Sort works on multi-digit numbers', () => {
      const input = [170, 45, 75, 90, 802, 24, 2, 66];
      const steps = generateSortingTrace(input, 'Radix Sort');
      expect(steps[steps.length - 1].array).toEqual([...input].sort((a, b) => a - b));
    });

    it('Bucket Sort correctly sorts integers', () => {
      const input = [29, 25, 3, 49, 9, 37, 21, 43];
      const steps = generateSortingTrace(input, 'Bucket Sort');
      expect(steps[steps.length - 1].array).toEqual([...input].sort((a, b) => a - b));
    });
  });
});

describe('Searching Trace Generation', () => {
  const searchAlgos = ['Linear Search', 'Binary Search', 'Jump Search', 'Interpolation Search', 'Exponential Search'];
  const sortedArray = [3, 8, 12, 19, 25, 31, 44, 52, 67, 89];

  searchAlgos.forEach(algo => {
    describe(`${algo}`, () => {
      it('finds target at first index', () => {
        const steps = generateSearchingTrace(sortedArray, algo, 3);
        const finalStep = steps[steps.length - 1];
        expect(finalStep.found).toBe(true);
      });

      it('finds target in middle', () => {
        const steps = generateSearchingTrace(sortedArray, algo, 25);
        const finalStep = steps[steps.length - 1];
        expect(finalStep.found).toBe(true);
      });

      it('finds target at last index', () => {
        const steps = generateSearchingTrace(sortedArray, algo, 89);
        const finalStep = steps[steps.length - 1];
        expect(finalStep.found).toBe(true);
      });

      it('reports not found when target is absent', () => {
        const steps = generateSearchingTrace(sortedArray, algo, 999);
        const finalStep = steps[steps.length - 1];
        expect(finalStep.found).toBe(false);
      });
    });
  });

  it('Linear Search preserves original order on unsorted arrays', () => {
    const unsorted = [45, 12, 89, 7, 23];
    const steps = generateSearchingTrace(unsorted, 'Linear Search', 89);
    expect(steps[0].array).toEqual([45, 12, 89, 7, 23]);
    const finalStep = steps[steps.length - 1];
    expect(finalStep.found).toBe(true);
  });
});
