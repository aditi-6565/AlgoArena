// AlgoArena Deterministic Searching Execution Trace Generator
// Produces step-by-step traces for 5 search algorithms with boundary tracking, bounds, comparisons and status

export function generateSearchingTrace(originalArray, algorithm, target) {
  const arr = [...originalArray];
  const steps = [];
  let comparisons = 0;

  const pushStep = (description, active = [], compared = [], bounds = {}, found = false, kind = 'compare', codeLine = 0) => {
    steps.push({
      array: [...arr],
      line: description,
      active,
      compared,
      low: bounds.low,
      high: bounds.high,
      mid: bounds.mid,
      comparisons,
      found,
      kind,
      codeLine
    });
  };

  const n = arr.length;
  if (n === 0) {
    pushStep('Array is empty. Target cannot be found.', [], [], {}, false, 'done', 0);
    return steps;
  }

  // Check if sorted for algorithms that strictly require monotonicity
  const isSorted = arr.every((val, i) => i === 0 || val >= arr[i - 1]);

  switch (algorithm) {
    case 'Linear Search': {
      pushStep(`Starting Linear Search for target ${target} from index 0 to ${n - 1}. Original order preserved.`, [], [], {}, false, 'start', 0);
      let foundIndex = -1;
      for (let i = 0; i < n; i++) {
        comparisons++;
        const isMatch = arr[i] === target;
        pushStep(`Check index ${i}: comparing A[${i}] (${arr[i]}) with target ${target}.`, [i], [i], { low: 0, high: n - 1 }, isMatch, 'compare', 2);
        if (isMatch) {
          foundIndex = i;
          pushStep(`Target ${target} successfully found at index ${i}!`, [i], [], { low: 0, high: n - 1 }, true, 'done', 3);
          break;
        }
      }
      if (foundIndex === -1) {
        pushStep(`Target ${target} is not present in the array after scanning all ${n} elements.`, [], [], {}, false, 'done', 4);
      }
      break;
    }

    case 'Binary Search': {
      if (!isSorted) {
        pushStep('WARNING: Binary Search requires a sorted array. Results may be inaccurate unless array is sorted.', [], [], {}, false, 'warning', 0);
      }
      pushStep(`Starting Binary Search for target ${target} within initial range [0..${n - 1}].`, [], [], { low: 0, high: n - 1 }, false, 'start', 1);
      let low = 0;
      let high = n - 1;
      let foundIndex = -1;

      while (low <= high) {
        const mid = Math.floor((low + high) / 2);
        comparisons++;
        const midVal = arr[mid];
        pushStep(`Evaluate midpoint index ${mid} (value ${midVal}) against target ${target}. Current interval: [${low}..${high}].`, [mid], [mid], { low, high, mid }, midVal === target, 'compare', 3);

        if (midVal === target) {
          foundIndex = mid;
          pushStep(`Found target ${target} at middle index ${mid}!`, [mid], [], { low, high, mid }, true, 'done', 4);
          break;
        } else if (midVal < target) {
          pushStep(`${midVal} < ${target}: target must lie in upper half. Narrow range to [${mid + 1}..${high}].`, [mid], [], { low: mid + 1, high, mid }, false, 'shift', 5);
          low = mid + 1;
        } else {
          pushStep(`${midVal} > ${target}: target must lie in lower half. Narrow range to [${low}..${mid - 1}].`, [mid], [], { low, high: mid - 1, mid }, false, 'shift', 6);
          high = mid - 1;
        }
      }

      if (foundIndex === -1) {
        pushStep(`Target ${target} is not present. Search interval reduced to empty.`, [], [], {}, false, 'done', 7);
      }
      break;
    }

    case 'Jump Search': {
      if (!isSorted) {
        pushStep('WARNING: Jump Search requires a monotonically sorted array.', [], [], {}, false, 'warning', 0);
      }
      const step = Math.floor(Math.sqrt(n)) || 1;
      pushStep(`Starting Jump Search with optimal block jump step size m = √${n} ≈ ${step}.`, [], [], {}, false, 'start', 2);
      let prev = 0;
      let curr = step;

      while (curr < n && arr[curr - 1] < target) {
        comparisons++;
        pushStep(`Block boundary A[${curr - 1}] (${arr[curr - 1]}) < ${target}. Jumping ahead by ${step}.`, [curr - 1], [curr - 1], { low: prev, high: curr }, false, 'compare', 4);
        prev = curr;
        curr += step;
      }

      const boundary = Math.min(curr, n);
      pushStep(`Target ${target} may reside in block between index ${prev} and ${boundary - 1}. Starting linear scan.`, [], [], { low: prev, high: boundary - 1 }, false, 'compare', 8);

      let found = false;
      for (let i = prev; i < boundary; i++) {
        comparisons++;
        pushStep(`Checking linear block element A[${i}] (${arr[i]}) vs target ${target}.`, [i], [i], { low: prev, high: boundary - 1 }, arr[i] === target, 'compare', 9);
        if (arr[i] === target) {
          found = true;
          pushStep(`Target ${target} found at index ${i}!`, [i], [], { low: prev, high: boundary - 1 }, true, 'done', 11);
          break;
        }
      }
      if (!found) {
        pushStep(`Target ${target} was not found in the identified block. Target is absent.`, [], [], {}, false, 'done', 12);
      }
      break;
    }

    case 'Interpolation Search': {
      if (!isSorted) {
        pushStep('WARNING: Interpolation Search requires a sorted array with numeric values.', [], [], {}, false, 'warning', 0);
      }
      pushStep(`Starting Interpolation Search for target ${target}. Assumes uniform value distribution.`, [], [], { low: 0, high: n - 1 }, false, 'start', 1);
      let low = 0;
      let high = n - 1;
      let found = false;

      while (low <= high && target >= arr[low] && target <= arr[high]) {
        comparisons++;
        if (low === high) {
          if (arr[low] === target) {
            pushStep(`Found target ${target} at solitary candidate index ${low}!`, [low], [], { low, high, mid: low }, true, 'done', 4);
            found = true;
          }
          break;
        }

        // Linear interpolation probe formula
        const fraction = (target - arr[low]) / (arr[high] - arr[low]);
        const pos = low + Math.floor(fraction * (high - low));

        pushStep(`Probing calculated position ${pos} using formula: fraction=${fraction.toFixed(2)}. Value at A[${pos}] is ${arr[pos]}.`, [pos], [pos], { low, high, mid: pos }, arr[pos] === target, 'compare', 5);

        if (arr[pos] === target) {
          found = true;
          pushStep(`Target ${target} found at probed index ${pos}!`, [pos], [], { low, high, mid: pos }, true, 'done', 6);
          break;
        } else if (arr[pos] < target) {
          pushStep(`A[${pos}] (${arr[pos]}) < ${target}: probe higher. New range [${pos + 1}..${high}].`, [pos], [], { low: pos + 1, high, mid: pos }, false, 'shift', 7);
          low = pos + 1;
        } else {
          pushStep(`A[${pos}] (${arr[pos]}) > ${target}: probe lower. New range [${low}..${pos - 1}].`, [pos], [], { low, high: pos - 1, mid: pos }, false, 'shift', 8);
          high = pos - 1;
        }
      }

      if (!found) {
        pushStep(`Target ${target} is outside remaining bounds or absent from the array.`, [], [], {}, false, 'done', 9);
      }
      break;
    }

    case 'Exponential Search': {
      if (!isSorted) {
        pushStep('WARNING: Exponential Search requires a sorted array.', [], [], {}, false, 'warning', 0);
      }
      pushStep(`Starting Exponential Search for target ${target}.`, [], [], {}, false, 'start', 0);
      if (arr[0] === target) {
        comparisons++;
        pushStep(`Target ${target} matches index 0 immediately!`, [0], [0], { low: 0, high: 0, mid: 0 }, true, 'done', 2);
        break;
      }

      let i = 1;
      while (i < n && arr[i] <= target) {
        comparisons++;
        pushStep(`Testing power-of-two index ${i} (value ${arr[i]}) <= target ${target}.`, [i], [i], { low: Math.floor(i / 2), high: i }, arr[i] === target, 'compare', 4);
        if (arr[i] === target) {
          pushStep(`Target ${target} found at exponential bound index ${i}!`, [i], [], { low: Math.floor(i / 2), high: i }, true, 'done', 4);
          return steps;
        }
        i *= 2;
      }

      const low = Math.floor(i / 2);
      const high = Math.min(i, n - 1);
      pushStep(`Target is bounded between index ${low} and ${high}. Conducting Binary Search within bounded range.`, [], [], { low, high }, false, 'compare', 6);

      let l = low;
      let r = high;
      let found = false;
      while (l <= r) {
        const mid = Math.floor((l + r) / 2);
        comparisons++;
        pushStep(`Binary search within bounded range: check mid index ${mid} (${arr[mid]}).`, [mid], [mid], { low: l, high: r, mid }, arr[mid] === target, 'compare', 6);
        if (arr[mid] === target) {
          found = true;
          pushStep(`Found target ${target} at index ${mid}!`, [mid], [], { low: l, high: r, mid }, true, 'done', 6);
          break;
        } else if (arr[mid] < target) {
          l = mid + 1;
        } else {
          r = mid - 1;
        }
      }
      if (!found) {
        pushStep(`Target ${target} not found within range [${low}..${high}].`, [], [], {}, false, 'done', 6);
      }
      break;
    }

    default:
      pushStep(`Searching trace for ${algorithm} completed.`, [], [], {}, false, 'done', 0);
  }

  return steps;
}
