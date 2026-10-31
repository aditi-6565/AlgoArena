// AlgoArena Deterministic Sorting Execution Trace Generator
// Produces accurate step-by-step traces for 10 sorting algorithms with operation counts and pseudocode sync

export function generateSortingTrace(originalArray, algorithm) {
  const arr = [...originalArray];
  const steps = [];
  let comparisons = 0;
  let swaps = 0;

  const pushStep = (description, active = [], compared = [], swappedIndices = [], sortedIndices = [], kind = 'compare', codeLine = 0) => {
    steps.push({
      array: [...arr],
      line: description,
      active,
      compared,
      swapped: swappedIndices,
      sorted: [...sortedIndices],
      comparisons,
      swaps,
      kind,
      codeLine
    });
  };

  const n = arr.length;
  if (n <= 1) {
    pushStep('Array contains 1 or 0 elements; already sorted.', [0], [], [], n === 1 ? [0] : [], 'done', 0);
    return steps;
  }

  switch (algorithm) {
    case 'Bubble Sort': {
      pushStep('Starting Bubble Sort. Comparisons will ripple adjacent pairs from left to right.', [], [], [], [], 'start', 0);
      const sorted = [];
      for (let i = 0; i < n - 1; i++) {
        let swappedThisPass = false;
        pushStep(`Pass ${i + 1}: starting adjacent comparisons up to index ${n - 1 - i}.`, [], [], [], sorted, 'compare', 2);
        for (let j = 0; j < n - 1 - i; j++) {
          comparisons++;
          pushStep(`Compare A[${j}] (${arr[j]}) with A[${j + 1}] (${arr[j + 1]}).`, [j, j + 1], [j, j + 1], [], sorted, 'compare', 5);
          if (arr[j] > arr[j + 1]) {
            swaps++;
            const temp = arr[j];
            arr[j] = arr[j + 1];
            arr[j + 1] = temp;
            swappedThisPass = true;
            pushStep(`Swap ${arr[j + 1]} and ${arr[j]} because ${arr[j + 1]} > ${arr[j]}.`, [j, j + 1], [], [j, j + 1], sorted, 'swap', 6);
          }
        }
        sorted.unshift(n - 1 - i);
        pushStep(`Element at index ${n - 1 - i} (${arr[n - 1 - i]}) is now in its finalized position.`, [n - 1 - i], [], [], sorted, 'done', 7);
        if (!swappedThisPass) {
          pushStep('No swaps were made in this pass! Early termination condition met.', [], [], [], Array.from({ length: n }, (_, k) => k), 'done', 8);
          break;
        }
      }
      sorted.unshift(0);
      pushStep('Bubble Sort completed. Array is fully sorted in ascending order.', [], [], [], Array.from({ length: n }, (_, k) => k), 'done', 8);
      break;
    }

    case 'Selection Sort': {
      pushStep('Starting Selection Sort. Iteratively find minimum of unsorted portion.', [], [], [], [], 'start', 0);
      const sorted = [];
      for (let i = 0; i < n - 1; i++) {
        let minIdx = i;
        pushStep(`Pass ${i + 1}: assume initial minimum is at index ${i} (value ${arr[i]}).`, [i], [], [], sorted, 'compare', 3);
        for (let j = i + 1; j < n; j++) {
          comparisons++;
          pushStep(`Compare candidate min A[${minIdx}] (${arr[minIdx]}) with A[${j}] (${arr[j]}).`, [j], [minIdx, j], [], sorted, 'compare', 5);
          if (arr[j] < arr[minIdx]) {
            minIdx = j;
            pushStep(`Found new minimum: ${arr[minIdx]} at index ${minIdx}.`, [minIdx], [], [], sorted, 'compare', 6);
          }
        }
        if (minIdx !== i) {
          swaps++;
          const temp = arr[i];
          arr[i] = arr[minIdx];
          arr[minIdx] = temp;
          pushStep(`Swap minimum value ${arr[i]} into position ${i}.`, [i, minIdx], [], [i, minIdx], sorted, 'swap', 8);
        } else {
          pushStep(`Value ${arr[i]} is already at its correct minimum position ${i}.`, [i], [], [], sorted, 'compare', 8);
        }
        sorted.push(i);
      }
      sorted.push(n - 1);
      pushStep('Selection Sort complete! All elements placed into correct positions.', [], [], [], Array.from({ length: n }, (_, k) => k), 'done', 8);
      break;
    }

    case 'Insertion Sort': {
      pushStep('Starting Insertion Sort. Index 0 is treated as a trivial sorted prefix.', [0], [], [], [0], 'start', 0);
      const sorted = [0];
      for (let i = 1; i < n; i++) {
        const key = arr[i];
        let j = i - 1;
        pushStep(`Pick key A[${i}] = ${key} to insert into sorted prefix [0..${i - 1}].`, [i], [], [], sorted, 'insert', 2);
        while (j >= 0) {
          comparisons++;
          pushStep(`Compare key ${key} with sorted prefix element A[${j}] (${arr[j]}).`, [j, i], [j, i], [], sorted, 'compare', 4);
          if (arr[j] > key) {
            arr[j + 1] = arr[j];
            swaps++;
            pushStep(`${arr[j]} > ${key}, shift ${arr[j]} right to index ${j + 1}.`, [j + 1], [], [j, j + 1], sorted, 'shift', 5);
            j--;
          } else {
            break;
          }
        }
        arr[j + 1] = key;
        sorted.push(i);
        pushStep(`Insert key ${key} into position ${j + 1}. Prefix [0..${i}] is now sorted.`, [j + 1], [], [], sorted, 'insert', 7);
      }
      pushStep('Insertion Sort complete. Full array is sorted.', [], [], [], Array.from({ length: n }, (_, k) => k), 'done', 7);
      break;
    }

    case 'Merge Sort': {
      pushStep('Starting Merge Sort. Recursively divide array into halves, then merge.', [], [], [], [], 'start', 0);
      const merge = (lo, mid, hi) => {
        pushStep(`Merging subarrays [${lo}..${mid}] and [${mid + 1}..${hi}].`, Array.from({ length: hi - lo + 1 }, (_, x) => lo + x), [], [], [], 'merge', 5);
        const left = arr.slice(lo, mid + 1);
        const right = arr.slice(mid + 1, hi + 1);
        let i = 0, j = 0, k = lo;
        while (i < left.length && j < right.length) {
          comparisons++;
          pushStep(`Compare left element ${left[i]} and right element ${right[j]}.`, [k], [lo + i, mid + 1 + j], [], [], 'compare', 5);
          if (left[i] <= right[j]) {
            arr[k] = left[i];
            i++;
          } else {
            arr[k] = right[j];
            j++;
          }
          swaps++;
          pushStep(`Placed ${arr[k]} at position ${k}.`, [k], [], [k], [], 'insert', 5);
          k++;
        }
        while (i < left.length) {
          arr[k] = left[i];
          swaps++;
          pushStep(`Copy remaining left element ${left[i]} to index ${k}.`, [k], [], [k], [], 'insert', 5);
          i++; k++;
        }
        while (j < right.length) {
          arr[k] = right[j];
          swaps++;
          pushStep(`Copy remaining right element ${right[j]} to index ${k}.`, [k], [], [k], [], 'insert', 5);
          j++; k++;
        }
        pushStep(`Subarray [${lo}..${hi}] successfully merged: [${arr.slice(lo, hi + 1).join(', ')}].`, Array.from({ length: hi - lo + 1 }, (_, x) => lo + x), [], [], [], 'merge', 5);
      };

      const sort = (lo, hi) => {
        if (lo >= hi) return;
        const mid = Math.floor((lo + hi) / 2);
        pushStep(`Split range [${lo}..${hi}] at mid index ${mid}.`, [mid], [], [], [], 'split', 2);
        sort(lo, mid);
        sort(mid + 1, hi);
        merge(lo, mid, hi);
      };

      sort(0, n - 1);
      pushStep('Merge Sort complete. Array is completely sorted.', [], [], [], Array.from({ length: n }, (_, k) => k), 'done', 5);
      break;
    }

    case 'Quick Sort': {
      pushStep('Starting Quick Sort. Partitioning around pivot using Lomuto method.', [], [], [], [], 'start', 0);
      const partition = (lo, hi) => {
        const pivot = arr[hi];
        let i = lo - 1;
        pushStep(`Choose pivot A[${hi}] = ${pivot} for subarray [${lo}..${hi}].`, [hi], [], [], [], 'pivot', 2);
        for (let j = lo; j < hi; j++) {
          comparisons++;
          pushStep(`Compare A[${j}] (${arr[j]}) with pivot ${pivot}.`, [j, hi], [j, hi], [], [], 'compare', 3);
          if (arr[j] < pivot) {
            i++;
            if (i !== j) {
              swaps++;
              const temp = arr[i];
              arr[i] = arr[j];
              arr[j] = temp;
              pushStep(`Swap A[${i}] (${arr[i]}) and A[${j}] (${arr[j]}) to shift smaller element left of boundary.`, [i, j], [], [i, j], [], 'swap', 4);
            }
          }
        }
        if (i + 1 !== hi) {
          swaps++;
          const temp = arr[i + 1];
          arr[i + 1] = arr[hi];
          arr[hi] = temp;
          pushStep(`Swap pivot ${pivot} into its sorted split position index ${i + 1}.`, [i + 1, hi], [], [i + 1, hi], [], 'swap', 4);
        } else {
          pushStep(`Pivot ${pivot} is already at its sorted position index ${hi}.`, [hi], [], [], [], 'pivot', 4);
        }
        return i + 1;
      };

      const sort = (lo, hi) => {
        if (lo >= hi) {
          if (lo === hi) pushStep(`Single element at index ${lo} is trivially in place.`, [lo], [], [], [], 'done', 1);
          return;
        }
        const p = partition(lo, hi);
        pushStep(`Partition complete: Pivot ${arr[p]} is fixed at index ${p}. Recurse on left [${lo}..${p - 1}] and right [${p + 1}..${hi}].`, [p], [], [], [p], 'pivot', 3);
        sort(lo, p - 1);
        sort(p + 1, hi);
      };

      sort(0, n - 1);
      pushStep('Quick Sort complete. All partitions resolved.', [], [], [], Array.from({ length: n }, (_, k) => k), 'done', 4);
      break;
    }

    case 'Heap Sort': {
      pushStep('Starting Heap Sort. First build a Max-Heap in-place from the array.', [], [], [], [], 'start', 0);
      const heapify = (size, root) => {
        let largest = root;
        const left = 2 * root + 1;
        const right = 2 * root + 2;

        if (left < size) {
          comparisons++;
          if (arr[left] > arr[largest]) largest = left;
        }
        if (right < size) {
          comparisons++;
          if (arr[right] > arr[largest]) largest = right;
        }

        if (largest !== root) {
          swaps++;
          const temp = arr[root];
          arr[root] = arr[largest];
          arr[largest] = temp;
          pushStep(`Heapify: swap root ${arr[largest]} with larger child ${arr[root]} at index ${largest}.`, [root, largest], [], [root, largest], [], 'heapify', 4);
          heapify(size, largest);
        }
      };

      // Build heap
      for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
        pushStep(`Building max heap: heapify subtree rooted at index ${i}.`, [i], [], [], [], 'heapify', 1);
        heapify(n, i);
      }
      pushStep('Max-heap successfully constructed. Root A[0] is the maximum element.', [0], [], [], [], 'heapify', 1);

      const sorted = [];
      // Extract elements
      for (let i = n - 1; i > 0; i--) {
        swaps++;
        const temp = arr[0];
        arr[0] = arr[i];
        arr[i] = temp;
        sorted.unshift(i);
        pushStep(`Swap max element ${arr[i]} to index ${i}. Reduce heap boundary to ${i}.`, [0, i], [], [0, i], sorted, 'swap', 3);
        heapify(i, 0);
      }
      sorted.unshift(0);
      pushStep('Heap Sort completed. All extracted elements form sorted array.', [], [], [], sorted, 'done', 4);
      break;
    }

    case 'Shell Sort': {
      pushStep('Starting Shell Sort with diminishing gap sequence floor(n / 2).', [], [], [], [], 'start', 0);
      for (let gap = Math.floor(n / 2); gap > 0; gap = Math.floor(gap / 2)) {
        pushStep(`Current gap = ${gap}. Performing h-sorting with gap ${gap}.`, [], [], [], [], 'compare', 1);
        for (let i = gap; i < n; i++) {
          const temp = arr[i];
          let j = i;
          pushStep(`Pick A[${i}] = ${temp} for gap-${gap} insertion.`, [i], [], [], [], 'insert', 3);
          while (j >= gap) {
            comparisons++;
            pushStep(`Compare A[${j - gap}] (${arr[j - gap]}) with temp ${temp}.`, [j - gap, j], [j - gap, j], [], [], 'compare', 4);
            if (arr[j - gap] > temp) {
              arr[j] = arr[j - gap];
              swaps++;
              pushStep(`Shift A[${j - gap}] (${arr[j]}) forward by gap ${gap} to index ${j}.`, [j], [], [j - gap, j], [], 'shift', 5);
              j -= gap;
            } else {
              break;
            }
          }
          arr[j] = temp;
          pushStep(`Place temp ${temp} at index ${j}.`, [j], [], [], [], 'insert', 7);
        }
      }
      pushStep('Shell Sort complete. Gap 1 resolved all remaining local inversions.', [], [], [], Array.from({ length: n }, (_, k) => k), 'done', 8);
      break;
    }

    case 'Counting Sort': {
      pushStep('Starting Counting Sort. Non-comparison integer sorting algorithm.', [], [], [], [], 'start', 0);
      const minVal = Math.min(...arr);
      const maxVal = Math.max(...arr);
      const range = maxVal - minVal + 1;
      pushStep(`Determined domain: min = ${minVal}, max = ${maxVal}, range = ${range}.`, [], [], [], [], 'compare', 1);

      const count = new Array(range).fill(0);
      for (let i = 0; i < n; i++) {
        count[arr[i] - minVal]++;
        pushStep(`Count frequency: value ${arr[i]} mapped to count index ${arr[i] - minVal} (total count: ${count[arr[i] - minVal]}).`, [i], [], [], [], 'insert', 2);
      }

      for (let i = 1; i < range; i++) {
        count[i] += count[i - 1];
      }
      pushStep('Computed prefix sums of counts for exact output positions.', [], [], [], [], 'compare', 3);

      const output = new Array(n);
      for (let i = n - 1; i >= 0; i--) {
        const val = arr[i];
        const pos = count[val - minVal] - 1;
        output[pos] = val;
        count[val - minVal]--;
        pushStep(`Place ${val} at output position ${pos} maintaining stability.`, [i], [], [pos], [], 'insert', 5);
      }

      for (let i = 0; i < n; i++) {
        arr[i] = output[i];
        swaps++;
      }
      pushStep('Counting Sort complete. Array successfully ordered.', [], [], [], Array.from({ length: n }, (_, k) => k), 'done', 7);
      break;
    }

    case 'Radix Sort': {
      pushStep('Starting LSD Radix Sort (base-10). Sorting by digit from least to most significant.', [], [], [], [], 'start', 0);
      const maxVal = Math.max(...arr);
      let exp = 1;
      let pass = 1;

      while (Math.floor(maxVal / exp) > 0) {
        pushStep(`Pass ${pass}: Sorting elements by digit position (10^${pass - 1} = ${exp}).`, [], [], [], [], 'compare', 2);
        const output = new Array(n);
        const count = new Array(10).fill(0);

        for (let i = 0; i < n; i++) {
          const digit = Math.floor(Math.abs(arr[i]) / exp) % 10;
          count[digit]++;
        }
        for (let i = 1; i < 10; i++) {
          count[i] += count[i - 1];
        }
        for (let i = n - 1; i >= 0; i--) {
          const digit = Math.floor(Math.abs(arr[i]) / exp) % 10;
          const pos = count[digit] - 1;
          output[pos] = arr[i];
          count[digit]--;
        }
        for (let i = 0; i < n; i++) {
          arr[i] = output[i];
          swaps++;
        }
        pushStep(`Pass ${pass} complete: array sorted up to ${exp}'s place: [${arr.join(', ')}].`, [], [], [], [], 'insert', 4);
        exp *= 10;
        pass++;
      }
      pushStep('Radix Sort complete. All digit passes processed.', [], [], [], Array.from({ length: n }, (_, k) => k), 'done', 4);
      break;
    }

    case 'Bucket Sort': {
      pushStep('Starting Bucket Sort. Dividing values into buckets, sorting buckets, then concatenating.', [], [], [], [], 'start', 0);
      const minVal = Math.min(...arr);
      const maxVal = Math.max(...arr);
      const bucketCount = Math.max(2, Math.min(5, n));
      const range = (maxVal - minVal) || 1;
      const buckets = Array.from({ length: bucketCount }, () => []);

      for (let i = 0; i < n; i++) {
        const normalized = (arr[i] - minVal) / range;
        const bIdx = Math.min(bucketCount - 1, Math.floor(normalized * bucketCount));
        buckets[bIdx].push(arr[i]);
        pushStep(`Placed ${arr[i]} into Bucket ${bIdx + 1} of ${bucketCount}.`, [i], [], [], [], 'insert', 2);
      }

      pushStep('Sorting individual buckets using Insertion Sort.', [], [], [], [], 'compare', 3);
      let idx = 0;
      for (let b = 0; b < bucketCount; b++) {
        buckets[b].sort((x, y) => x - y);
        for (let item of buckets[b]) {
          arr[idx++] = item;
          swaps++;
        }
        pushStep(`Concatenated sorted Bucket ${b + 1}: [${buckets[b].join(', ')}].`, Array.from({ length: idx }, (_, k) => k), [], [], [], 'insert', 4);
      }
      pushStep('Bucket Sort complete. Buckets successfully concatenated in order.', [], [], [], Array.from({ length: n }, (_, k) => k), 'done', 4);
      break;
    }

    default:
      pushStep(`Algorithm ${algorithm} trace complete.`, [], [], [], [], 'done', 0);
  }

  return steps;
}
