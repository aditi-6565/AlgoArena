// AlgoArena Comprehensive Algorithm & Data Structure Registry
// Academically rigorous metadata, complexity analyses, and pseudocode definitions

export const ALGORITHM_FAMILIES = {
  SORTING: 'Sorting',
  SEARCHING: 'Searching',
  DATA_STRUCTURES: 'Data Structures',
  GRAPHS: 'Graph Algorithms',
  GREEDY: 'Greedy Algorithms',
  DYNAMIC_PROGRAMMING: 'Dynamic Programming',
  BACKTRACKING: 'Backtracking',
  COMPLEXITY: 'Complexity Analysis',
  COMPARISON: 'Comparison Studio',
  PRACTICE: 'Practice & Quizzes',
  PROGRESS: 'Learning Progress'
};

export const ALGORITHMS_DATA = {
  // --- SORTING ---
  'Bubble Sort': {
    name: 'Bubble Sort',
    family: ALGORITHM_FAMILIES.SORTING,
    timeBest: 'O(n)',
    timeAvg: 'O(n²)',
    timeWorst: 'O(n²)',
    space: 'O(1)',
    stable: true,
    description: 'Repeatedly steps through the list, compares adjacent elements, and swaps them if they are in the wrong order. The largest unsorted element bubbles up to its correct position in each pass.',
    principle: 'Adjacent comparison and conditional swapping across multiple passes until no swaps are needed (optimized with a swapped flag).',
    pros: ['Simple to understand and implement', 'In-place with O(1) auxiliary space', 'Adaptive with early exit detection'],
    cons: ['O(n²) comparisons and swaps make it impractical for large datasets', 'Excessive memory writes compared to Selection Sort'],
    applications: ['Educational purposes', 'Detecting if an array is almost sorted in O(n) time'],
    pseudocode: [
      'BUBBLE_SORT(A):',
      '  n = length(A)',
      '  for i = 0 to n - 2:',
      '    swapped = false',
      '    for j = 0 to n - 2 - i:',
      '      if A[j] > A[j + 1]:',
      '        swap(A[j], A[j + 1])',
      '        swapped = true',
      '    if not swapped: break'
    ]
  },
  'Selection Sort': {
    name: 'Selection Sort',
    family: ALGORITHM_FAMILIES.SORTING,
    timeBest: 'O(n²)',
    timeAvg: 'O(n²)',
    timeWorst: 'O(n²)',
    space: 'O(1)',
    stable: false,
    description: 'Divides the array into sorted and unsorted subarrays. Repeatedly finds the minimum element from the unsorted subarray and places it at the beginning.',
    principle: 'Greedy selection of the minimum element in the remaining unsorted suffix, followed by a single swap per pass.',
    pros: ['Minimizes memory writes (at most n - 1 swaps)', 'In-place memory usage', 'Predictable O(n²) runtime regardless of initial order'],
    cons: ['Always performs O(n²) comparisons even on already sorted arrays', 'Unstable by default'],
    applications: ['Embedded systems where flash write cycles are expensive', 'Small auxiliary buffers'],
    pseudocode: [
      'SELECTION_SORT(A):',
      '  n = length(A)',
      '  for i = 0 to n - 2:',
      '    min_idx = i',
      '    for j = i + 1 to n - 1:',
      '      if A[j] < A[min_idx]:',
      '        min_idx = j',
      '    if min_idx != i:',
      '      swap(A[i], A[min_idx])'
    ]
  },
  'Insertion Sort': {
    name: 'Insertion Sort',
    family: ALGORITHM_FAMILIES.SORTING,
    timeBest: 'O(n)',
    timeAvg: 'O(n²)',
    timeWorst: 'O(n²)',
    space: 'O(1)',
    stable: true,
    description: 'Iteratively builds a sorted prefix by picking the next element and shifting larger elements to the right to insert it in its appropriate position.',
    principle: 'Incremental construction akin to sorting playing cards in hand.',
    pros: ['Very efficient for small datasets (n < 30)', 'Adaptive: O(n) for nearly sorted inputs', 'Online: can sort a streaming list as items arrive', 'Stable and in-place'],
    cons: ['O(n²) shifts in average and worst cases'],
    applications: ['Base case in hybrid sorts (Timsort, Introsort)', 'Online stream processing'],
    pseudocode: [
      'INSERTION_SORT(A):',
      '  for i = 1 to length(A) - 1:',
      '    key = A[i]',
      '    j = i - 1',
      '    while j >= 0 and A[j] > key:',
      '      A[j + 1] = A[j]',
      '      j = j - 1',
      '    A[j + 1] = key'
    ]
  },
  'Merge Sort': {
    name: 'Merge Sort',
    family: ALGORITHM_FAMILIES.SORTING,
    timeBest: 'O(n log n)',
    timeAvg: 'O(n log n)',
    timeWorst: 'O(n log n)',
    space: 'O(n)',
    stable: true,
    description: 'A divide-and-conquer algorithm that recursively splits the array into two halves, sorts each half, and merges the two sorted halves into a single sorted array.',
    principle: 'Divide into halves, conquer recursively, and merge two sorted subarrays using two pointers.',
    pros: ['Guaranteed O(n log n) worst-case time', 'Stable sorting preservation', 'Well-suited for external sorting and linked lists'],
    cons: ['Requires O(n) auxiliary memory for standard array merge'],
    applications: ['External sorting of massive databases', 'Default for language standard libraries (Python, Java objects)'],
    pseudocode: [
      'MERGE_SORT(A, left, right):',
      '  if left < right:',
      '    mid = (left + right) // 2',
      '    MERGE_SORT(A, left, mid)',
      '    MERGE_SORT(A, mid + 1, right)',
      '    MERGE(A, left, mid, right)'
    ]
  },
  'Quick Sort': {
    name: 'Quick Sort',
    family: ALGORITHM_FAMILIES.SORTING,
    timeBest: 'O(n log n)',
    timeAvg: 'O(n log n)',
    timeWorst: 'O(n²)',
    space: 'O(log n)',
    stable: false,
    description: 'Selects a pivot element and partitions the array such that all items less than the pivot are placed before it and all items greater are placed after it, then recurses on the partitions.',
    principle: 'Divide-and-conquer with in-place Lomuto or Hoare partitioning.',
    pros: ['Extremely fast in practice with low constant factors', 'In-place with O(log n) call stack auxiliary memory', 'Cache friendly due to localized memory access'],
    cons: ['Degrades to O(n²) with poor pivot choices', 'Not stable in standard array form'],
    applications: ['C qsort, C++ std::sort (Introsort)', 'Systems programming'],
    pseudocode: [
      'QUICK_SORT(A, low, high):',
      '  if low < high:',
      '    pivotIndex = PARTITION(A, low, high)',
      '    QUICK_SORT(A, low, pivotIndex - 1)',
      '    QUICK_SORT(A, pivotIndex + 1, high)'
    ]
  },
  'Heap Sort': {
    name: 'Heap Sort',
    family: ALGORITHM_FAMILIES.SORTING,
    timeBest: 'O(n log n)',
    timeAvg: 'O(n log n)',
    timeWorst: 'O(n log n)',
    space: 'O(1)',
    stable: false,
    description: 'Builds a max-heap from the input array, then repeatedly extracts the maximum element and swaps it with the last unsorted element, restoring the heap property via heapify.',
    principle: 'Binary heap data structure utilizing array indexing (left=2i+1, right=2i+2) for in-place selection of extremes.',
    pros: ['Guaranteed O(n log n) runtime without O(n) extra space', 'In-place O(1) space'],
    cons: ['Poor cache locality due to non-sequential parent-child leaps', 'Not stable'],
    applications: ['Kernel scheduling where worst-case memory and time bounds are critical'],
    pseudocode: [
      'HEAP_SORT(A):',
      '  BUILD_MAX_HEAP(A)',
      '  for i = length(A) - 1 down to 1:',
      '    swap(A[0], A[i])',
      '    MAX_HEAPIFY(A, 0, i)'
    ]
  },
  'Shell Sort': {
    name: 'Shell Sort',
    family: ALGORITHM_FAMILIES.SORTING,
    timeBest: 'O(n log n)',
    timeAvg: 'O(n^(4/3))',
    timeWorst: 'O(n²)',
    space: 'O(1)',
    stable: false,
    description: 'A generalization of insertion sort that allows exchanges of elements that are far apart using a diminishing gap sequence, finishing with gap=1.',
    principle: 'h-sorting using gap intervals (e.g. n/2, n/4, ..., 1) to quickly eliminate large inversions.',
    pros: ['Simple, fast in-place sort for medium-sized lists', 'No recursive stack overhead'],
    cons: ['Performance heavily depends on the chosen gap sequence', 'Not stable'],
    applications: ['Embedded microcontrollers with tight stack limits'],
    pseudocode: [
      'SHELL_SORT(A):',
      '  gap = length(A) // 2',
      '  while gap > 0:',
      '    for i = gap to length(A) - 1:',
      '      temp = A[i]; j = i',
      '      while j >= gap and A[j - gap] > temp:',
      '        A[j] = A[j - gap]',
      '        j = j - gap',
      '      A[j] = temp',
      '    gap = gap // 2'
    ]
  },
  'Counting Sort': {
    name: 'Counting Sort',
    family: ALGORITHM_FAMILIES.SORTING,
    timeBest: 'O(n + k)',
    timeAvg: 'O(n + k)',
    timeWorst: 'O(n + k)',
    space: 'O(k)',
    stable: true,
    description: 'Non-comparison integer sort that tallies occurrences of each distinct key in a frequency array, computes cumulative sums, and places items into their exact output positions.',
    principle: 'Direct address indexing based on discrete integer frequencies.',
    pros: ['Linear time O(n + k) when range k is small relative to n', 'Stable algorithm'],
    cons: ['Only works on discrete integers within a bounded range [min, max]', 'Requires O(k) extra memory, which explodes if range is large'],
    applications: ['Subroutine in Radix Sort', 'Sorting test scores in range 0-100'],
    pseudocode: [
      'COUNTING_SORT(A):',
      '  k = max(A) - min(A) + 1',
      '  count = array of zeros of size k',
      '  for x in A: count[x - min]++',
      '  for i = 1 to k - 1: count[i] += count[i - 1]',
      '  for i = length(A) - 1 down to 0:',
      '    output[count[A[i] - min] - 1] = A[i]',
      '    count[A[i] - min]--',
      '  return output'
    ]
  },
  'Radix Sort': {
    name: 'Radix Sort',
    family: ALGORITHM_FAMILIES.SORTING,
    timeBest: 'O(d * (n + b))',
    timeAvg: 'O(d * (n + b))',
    timeWorst: 'O(d * (n + b))',
    space: 'O(n + b)',
    stable: true,
    description: 'Non-comparison sort that processes integers digit by digit from least significant digit (LSD) to most significant digit using a stable sorting subroutine (Counting Sort).',
    principle: 'Position-wise digit classification leveraging stable sorting preservation.',
    pros: ['Linear time O(d * n) when key length d is fixed', 'Stable'],
    cons: ['Limited to non-negative integers or fixed-length strings', 'Higher constant overhead than Quick Sort'],
    applications: ['Sorting fixed-width identifiers, telephone numbers, postal codes'],
    pseudocode: [
      'RADIX_SORT(A):',
      '  max_val = max(A)',
      '  exp = 1',
      '  while max_val // exp > 0:',
      '    COUNTING_SORT_BY_DIGIT(A, exp)',
      '    exp *= 10'
    ]
  },
  'Bucket Sort': {
    name: 'Bucket Sort',
    family: ALGORITHM_FAMILIES.SORTING,
    timeBest: 'O(n + k)',
    timeAvg: 'O(n + k)',
    timeWorst: 'O(n²)',
    space: 'O(n + k)',
    stable: true,
    description: 'Partitions elements into an array of buckets across the range, sorts each individual bucket (typically with Insertion Sort), and concatenates them.',
    principle: 'Scatter-gather approach assuming uniform distribution of input values.',
    pros: ['Linear O(n) average time for uniformly distributed numbers', 'Easily parallelizable'],
    cons: ['Degrades to O(n²) if all values cluster in a single bucket', 'Requires knowledge of distribution'],
    applications: ['Sorting floating-point numbers uniformly distributed in [0, 1)'],
    pseudocode: [
      'BUCKET_SORT(A, bucket_count):',
      '  buckets = array of empty lists',
      '  for x in A:',
      '    idx = floor(bucket_count * normalize(x))',
      '    buckets[idx].append(x)',
      '  for b in buckets: INSERTION_SORT(b)',
      '  return concatenate(buckets)'
    ]
  },

  // --- SEARCHING ---
  'Linear Search': {
    name: 'Linear Search',
    family: ALGORITHM_FAMILIES.SEARCHING,
    timeBest: 'O(1)',
    timeAvg: 'O(n)',
    timeWorst: 'O(n)',
    space: 'O(1)',
    description: 'Sequentially checks each element in the collection from index 0 through n - 1 until a match is found or the end of the array is reached.',
    principle: 'Exhaustive sequential verification preserving the original input order without modification.',
    pros: ['Works on any collection: unsorted, linked lists, arrays', 'No preprocessing required', 'O(1) extra space'],
    cons: ['O(n) comparisons makes it slow for large collections'],
    applications: ['Small arrays (n < 20)', 'Unordered list lookups'],
    pseudocode: [
      'LINEAR_SEARCH(A, target):',
      '  for i = 0 to length(A) - 1:',
      '    if A[i] == target:',
      '      return i',
      '  return NOT_FOUND'
    ]
  },
  'Binary Search': {
    name: 'Binary Search',
    family: ALGORITHM_FAMILIES.SEARCHING,
    timeBest: 'O(1)',
    timeAvg: 'O(log n)',
    timeWorst: 'O(log n)',
    space: 'O(1)',
    description: 'Locates the position of a target value within a sorted array by repeatedly comparing the target to the middle element and halving the search interval.',
    principle: 'Divide-and-conquer on monotonic (sorted) sequence.',
    pros: ['Logarithmic O(log n) time complexity', 'Ideal for static lookup tables'],
    cons: ['Strict prerequisite: array MUST be sorted', 'Requires random access (not optimal on linked lists)'],
    applications: ['Standard library lookups (bsearch, bisect)', 'Database index scans'],
    pseudocode: [
      'BINARY_SEARCH(A, target):',
      '  low = 0; high = length(A) - 1',
      '  while low <= high:',
      '    mid = (low + high) // 2',
      '    if A[mid] == target: return mid',
      '    else if A[mid] < target: low = mid + 1',
      '    else: high = mid - 1',
      '  return NOT_FOUND'
    ]
  },
  'Jump Search': {
    name: 'Jump Search',
    family: ALGORITHM_FAMILIES.SEARCHING,
    timeBest: 'O(1)',
    timeAvg: 'O(√n)',
    timeWorst: 'O(√n)',
    space: 'O(1)',
    description: 'Searches a sorted array by jumping forward in fixed steps of size √n, then performing a backward linear search once the interval containing the target is identified.',
    principle: 'Block jumping followed by localized linear scanning.',
    pros: ['Better than linear search (O(√n) vs O(n))', 'Jumps backward only once, advantageous when backward jumps are expensive'],
    cons: ['Slower than Binary Search O(log n)', 'Requires sorted data'],
    applications: ['Systems where jumping backwards is expensive (e.g. tape drives, certain file offsets)'],
    pseudocode: [
      'JUMP_SEARCH(A, target):',
      '  n = length(A)',
      '  step = floor(sqrt(n))',
      '  prev = 0',
      '  while A[min(step, n) - 1] < target:',
      '    prev = step',
      '    step += floor(sqrt(n))',
      '    if prev >= n: return NOT_FOUND',
      '  while A[prev] < target:',
      '    prev++',
      '    if prev == min(step, n): return NOT_FOUND',
      '  if A[prev] == target: return prev',
      '  return NOT_FOUND'
    ]
  },
  'Interpolation Search': {
    name: 'Interpolation Search',
    family: ALGORITHM_FAMILIES.SEARCHING,
    timeBest: 'O(1)',
    timeAvg: 'O(log log n)',
    timeWorst: 'O(n)',
    space: 'O(1)',
    description: 'An improvement over binary search for uniformly distributed sorted values. Estimates probe position based on the target value relative to the range bounds.',
    principle: 'Linear interpolation formula: pos = low + [(target - A[low]) * (high - low)] / (A[high] - A[low]).',
    pros: ['Extremely fast O(log log n) average time on uniformly distributed data'],
    cons: ['Degrades to O(n) if data is exponentially or non-uniformly distributed', 'Requires sorted data and arithmetic division'],
    applications: ['Telephone directories, dictionary lookups, uniformly indexed database records'],
    pseudocode: [
      'INTERPOLATION_SEARCH(A, target):',
      '  low = 0; high = length(A) - 1',
      '  while low <= high and target >= A[low] and target <= A[high]:',
      '    if low == high: return (A[low] == target ? low : NOT_FOUND)',
      '    pos = low + floor(((target - A[low]) * (high - low)) / (A[high] - A[low]))',
      '    if A[pos] == target: return pos',
      '    if A[pos] < target: low = pos + 1',
      '    else: high = pos - 1',
      '  return NOT_FOUND'
    ]
  },
  'Exponential Search': {
    name: 'Exponential Search',
    family: ALGORITHM_FAMILIES.SEARCHING,
    timeBest: 'O(1)',
    timeAvg: 'O(log i)',
    timeWorst: 'O(log i)',
    space: 'O(1)',
    description: 'Finds the range where the target resides by testing powers of 2 (indices 1, 2, 4, 8...), then performs a binary search within that confirmed bounded range.',
    principle: 'Exponential doubling followed by localized binary search.',
    pros: ['O(log i) where i is the target index position', 'Especially effective for unbounded or infinite lists'],
    cons: ['Requires sorted data'],
    applications: ['Searching unbounded data streams where length is unknown in advance'],
    pseudocode: [
      'EXPONENTIAL_SEARCH(A, target):',
      '  if length(A) == 0: return NOT_FOUND',
      '  if A[0] == target: return 0',
      '  i = 1',
      '  while i < length(A) and A[i] <= target:',
      '    i = i * 2',
      '  return BINARY_SEARCH_RANGE(A, target, i // 2, min(i, length(A) - 1))'
    ]
  },

  // --- DATA STRUCTURES ---
  'Array': {
    name: 'Array',
    family: ALGORITHM_FAMILIES.DATA_STRUCTURES,
    timeAccess: 'O(1)',
    timeSearch: 'O(n)',
    timeInsert: 'O(n)',
    timeDelete: 'O(n)',
    space: 'O(n)',
    description: 'A contiguous block of memory holding elements of the same type accessible via integer zero-based index offsets.',
    operations: ['Access', 'Search', 'Insert at index', 'Delete at index', 'Update at index', 'Traverse']
  },
  'Stack': {
    name: 'Stack',
    family: ALGORITHM_FAMILIES.DATA_STRUCTURES,
    timePush: 'O(1)',
    timePop: 'O(1)',
    timePeek: 'O(1)',
    space: 'O(n)',
    description: 'A linear data structure following the Last-In-First-Out (LIFO) principle where insertions and deletions take place exclusively at the top.',
    operations: ['Push', 'Pop', 'Peek', 'IsEmpty', 'IsFull', 'Size']
  },
  'Queue': {
    name: 'Queue',
    family: ALGORITHM_FAMILIES.DATA_STRUCTURES,
    timeEnqueue: 'O(1)',
    timeDequeue: 'O(1)',
    timePeek: 'O(1)',
    space: 'O(n)',
    description: 'A linear data structure operating on the First-In-First-Out (FIFO) principle with insertions at the rear and removals at the front.',
    operations: ['Enqueue', 'Dequeue', 'Peek Front', 'Peek Rear', 'IsEmpty', 'IsFull']
  },
  'Circular Queue': {
    name: 'Circular Queue',
    family: ALGORITHM_FAMILIES.DATA_STRUCTURES,
    timeEnqueue: 'O(1)',
    timeDequeue: 'O(1)',
    space: 'O(n)',
    description: 'An optimized queue implementation using a fixed-size ring buffer where the next index after the last position wraps back around to index 0 via modulo arithmetic.',
    operations: ['Enqueue', 'Dequeue', 'Wraparound Inspection', 'Full/Empty Checks']
  },
  'Deque': {
    name: 'Double-Ended Queue (Deque)',
    family: ALGORITHM_FAMILIES.DATA_STRUCTURES,
    timeInsert: 'O(1)',
    timeDelete: 'O(1)',
    space: 'O(n)',
    description: 'A generalized queue allowing high-efficiency insertion and deletion at both the front and the rear ends in O(1) time.',
    operations: ['Insert Front', 'Insert Rear', 'Delete Front', 'Delete Rear', 'Peek Front', 'Peek Rear']
  },
  'Linked List': {
    name: 'Linked Lists (Singly, Doubly, Circular)',
    family: ALGORITHM_FAMILIES.DATA_STRUCTURES,
    timeAccess: 'O(n)',
    timeInsertHead: 'O(1)',
    timeInsertTail: 'O(1)',
    space: 'O(n)',
    description: 'A sequence of node structures where each node contains data and references (pointers) to the next (and previous in DLL) nodes.',
    operations: ['Insert Head', 'Insert Tail', 'Insert Position', 'Delete Value', 'Delete Position', 'Reverse', 'Traverse']
  },
  'Binary Search Tree': {
    name: 'Binary Search Tree (BST)',
    family: ALGORITHM_FAMILIES.DATA_STRUCTURES,
    timeSearch: 'O(h)',
    timeInsert: 'O(h)',
    timeDelete: 'O(h)',
    space: 'O(n)',
    description: 'A hierarchical node-based tree where the left subtree contains keys smaller than the node, and the right subtree contains keys larger.',
    operations: ['Insert', 'Search', 'Delete (Leaf, 1-Child, 2-Child with successor)', 'Inorder', 'Preorder', 'Postorder', 'Level-order']
  },
  'AVL Tree': {
    name: 'AVL Tree (Self-Balancing BST)',
    family: ALGORITHM_FAMILIES.DATA_STRUCTURES,
    timeSearch: 'O(log n)',
    timeInsert: 'O(log n)',
    timeDelete: 'O(log n)',
    space: 'O(n)',
    description: 'A self-balancing BST where the difference between heights of left and right subtrees (balance factor) cannot exceed 1 for any node, maintained by LL, RR, LR, and RL rotations.',
    operations: ['Insert', 'Delete', 'Calculate Balance Factor', 'Rotations (LL, RR, LR, RL)']
  },
  'Heap': {
    name: 'Heap (Min Heap & Max Heap)',
    family: ALGORITHM_FAMILIES.DATA_STRUCTURES,
    timePeek: 'O(1)',
    timeInsert: 'O(log n)',
    timeExtract: 'O(log n)',
    space: 'O(n)',
    description: 'A complete binary tree satisfying the heap property: parent is always smaller/equal (Min-Heap) or greater/equal (Max-Heap) than its children.',
    operations: ['Insert', 'Extract Min/Max', 'Peek', 'Heapify Up', 'Heapify Down', 'Build Heap']
  },
  'Hash Table': {
    name: 'Hash Table (Chaining & Open Addressing)',
    family: ALGORITHM_FAMILIES.DATA_STRUCTURES,
    timeSearchAvg: 'O(1)',
    timeInsertAvg: 'O(1)',
    timeDeleteAvg: 'O(1)',
    space: 'O(n)',
    description: 'Maps associative keys to bucket indices using a hash function, with collision resolution via Separate Chaining, Linear Probing, Quadratic Probing, or Double Hashing.',
    operations: ['Insert', 'Search', 'Delete', 'Collision Handling Strategies']
  },

  // --- GRAPH ALGORITHMS ---
  'BFS': {
    name: 'Breadth-First Search (BFS)',
    family: ALGORITHM_FAMILIES.GRAPHS,
    time: 'O(V + E)',
    space: 'O(V)',
    description: 'Explores the graph level by level starting from a chosen root using a FIFO queue, guaranteeing shortest path in unweighted graphs.',
    pseudocode: [
      'BFS(graph, start):',
      '  queue = [start]',
      '  visited = {start}',
      '  while queue is not empty:',
      '    u = queue.pop_front()',
      '    for each neighbor v of u:',
      '      if v not in visited:',
      '        visited.add(v)',
      '        queue.push_back(v)'
    ]
  },
  'DFS': {
    name: 'Depth-First Search (DFS)',
    family: ALGORITHM_FAMILIES.GRAPHS,
    time: 'O(V + E)',
    space: 'O(V)',
    description: 'Explores as far as possible along each branch before backtracking using a recursion stack or LIFO data structure.',
    pseudocode: [
      'DFS(graph, u, visited):',
      '  visited.add(u)',
      '  for each neighbor v of u:',
      '    if v not in visited:',
      '      DFS(graph, v, visited)'
    ]
  },
  'Dijkstra': {
    name: "Dijkstra's Shortest Path",
    family: ALGORITHM_FAMILIES.GRAPHS,
    time: 'O((V + E) log V)',
    space: 'O(V)',
    description: 'Computes single-source shortest paths on graphs with non-negative edge weights using a greedy priority queue selection.',
    pseudocode: [
      'DIJKSTRA(graph, start):',
      '  dist = {all: infinity}; dist[start] = 0',
      '  pq = min_priority_queue([(0, start)])',
      '  while pq is not empty:',
      '    (d, u) = pq.pop_min()',
      '    if d > dist[u]: continue',
      '    for each (v, weight) in graph[u]:',
      '      if dist[u] + weight < dist[v]:',
      '        dist[v] = dist[u] + weight',
      '        pq.push((dist[v], v))'
    ]
  },
  'Bellman-Ford': {
    name: 'Bellman-Ford Algorithm',
    family: ALGORITHM_FAMILIES.GRAPHS,
    time: 'O(V * E)',
    space: 'O(V)',
    description: 'Finds single-source shortest paths while supporting negative edge weights and detecting negative weight cycles.',
    pseudocode: [
      'BELLMAN_FORD(vertices, edges, start):',
      '  dist = {all: infinity}; dist[start] = 0',
      '  repeat |V| - 1 times:',
      '    for each (u, v, weight) in edges:',
      '      if dist[u] + weight < dist[v]:',
      '        dist[v] = dist[u] + weight',
      '  for each (u, v, weight) in edges:',
      '    if dist[u] + weight < dist[v]:',
      '      REPORT_NEGATIVE_CYCLE()'
    ]
  },
  'Floyd-Warshall': {
    name: 'Floyd-Warshall Algorithm',
    family: ALGORITHM_FAMILIES.GRAPHS,
    time: 'O(V³)',
    space: 'O(V²)',
    description: 'Dynamic programming approach that finds all-pairs shortest paths by iteratively considering each vertex k as an intermediate step.',
    pseudocode: [
      'FLOYD_WARSHALL(V, dist):',
      '  for k = 0 to V - 1:',
      '    for i = 0 to V - 1:',
      '      for j = 0 to V - 1:',
      '        dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j])'
    ]
  },
  'Prim': {
    name: "Prim's Minimum Spanning Tree",
    family: ALGORITHM_FAMILIES.GRAPHS,
    time: 'O(E log V)',
    space: 'O(V)',
    description: 'Builds a minimum spanning tree starting from an arbitrary vertex, greedily adding the cheapest edge connecting the growing tree to an unvisited vertex.',
    pseudocode: [
      'PRIM(graph, start):',
      '  in_mst = {start}',
      '  while |in_mst| < |V|:',
      '    find minimum weight edge (u, v) where u in in_mst and v not in in_mst',
      '    add (u, v) to MST',
      '    in_mst.add(v)'
    ]
  },
  'Kruskal': {
    name: "Kruskal's Minimum Spanning Tree",
    family: ALGORITHM_FAMILIES.GRAPHS,
    time: 'O(E log E)',
    space: 'O(V)',
    description: 'Constructs an MST by sorting all edges by weight and greedily picking edges that do not form a cycle, verified using Disjoint Set Union (Union-Find).',
    pseudocode: [
      'KRUSKAL(V, edges):',
      '  sort edges by weight ascending',
      '  dsu = make_disjoint_set(V)',
      '  mst = []',
      '  for (u, v, w) in edges:',
      '    if dsu.find(u) != dsu.find(v):',
      '      dsu.union(u, v)',
      '      mst.append((u, v, w))'
    ]
  },
  'Topological Sort': {
    name: 'Topological Sort',
    family: ALGORITHM_FAMILIES.GRAPHS,
    time: 'O(V + E)',
    space: 'O(V)',
    description: 'Linear ordering of vertices in a Directed Acyclic Graph (DAG) such that for every directed edge u -> v, vertex u comes before v. Rejects cycles.',
    pseudocode: [
      'TOPOLOGICAL_SORT(DAG):',
      '  in_degree = compute_in_degrees(DAG)',
      '  queue = [v for v in V if in_degree[v] == 0]',
      '  order = []',
      '  while queue is not empty:',
      '    u = queue.pop_front()',
      '    order.append(u)',
      '    for neighbor v of u:',
      '      in_degree[v]--',
      '      if in_degree[v] == 0: queue.push_back(v)'
    ]
  },
  'Cycle Detection': {
    name: 'Cycle Detection (Directed & Undirected)',
    family: ALGORITHM_FAMILIES.GRAPHS,
    time: 'O(V + E)',
    space: 'O(V)',
    description: 'Detects cycles using DFS back-edge identification (3-color state: unvisited, in-stack, finished for directed; parent tracking for undirected).',
    pseudocode: [
      'HAS_CYCLE(u, visited, recStack):',
      '  visited[u] = true; recStack[u] = true',
      '  for neighbor v of u:',
      '    if not visited[v] and HAS_CYCLE(v, visited, recStack): return true',
      '    else if recStack[v]: return true',
      '  recStack[u] = false',
      '  return false'
    ]
  },
  'Connected Components': {
    name: 'Connected Components',
    family: ALGORITHM_FAMILIES.GRAPHS,
    time: 'O(V + E)',
    space: 'O(V)',
    description: 'Partitions an undirected graph into maximal sets of connected vertices using repeated BFS/DFS traversals.',
    pseudocode: [
      'CONNECTED_COMPONENTS(graph):',
      '  visited = {}',
      '  components = []',
      '  for v in vertices:',
      '    if v not in visited:',
      '      comp = BFS_COLLECT(v, visited)',
      '      components.append(comp)'
    ]
  },
  'Strongly Connected Components': {
    name: "Strongly Connected Components (Kosaraju's Algorithm)",
    family: ALGORITHM_FAMILIES.GRAPHS,
    time: 'O(V + E)',
    space: 'O(V)',
    description: 'Identifies maximal subgraphs where every vertex is reachable from every other vertex using two DFS passes and a transposed graph.',
    pseudocode: [
      'KOSARAJU(graph):',
      '  stack = []',
      '  1. Run DFS on graph, pushing to stack on exit',
      '  2. Transpose graph (reverse all directed edges)',
      '  3. Pop vertices from stack; run DFS on transposed graph to form SCCs'
    ]
  },
  'Bipartite Graph Check': {
    name: 'Bipartite Graph Checking',
    family: ALGORITHM_FAMILIES.GRAPHS,
    time: 'O(V + E)',
    space: 'O(V)',
    description: 'Checks if vertices can be colored using 2 colors such that no two adjacent vertices share the same color (equivalent to having no odd cycles).',
    pseudocode: [
      'IS_BIPARTITE(graph):',
      '  color = {all: -1}',
      '  for start in vertices:',
      '    if color[start] == -1:',
      '      color[start] = 0',
      '      queue = [start]',
      '      while queue is not empty:',
      '        u = queue.pop_front()',
      '        for v in graph[u]:',
      '          if color[v] == -1:',
      '            color[v] = 1 - color[u]',
      '            queue.push(v)',
      '          else if color[v] == color[u]: return false',
      '  return true'
    ]
  },
  'Articulation Points': {
    name: 'Articulation Points (Cut Vertices)',
    family: ALGORITHM_FAMILIES.GRAPHS,
    time: 'O(V + E)',
    space: 'O(V)',
    description: 'Finds vertices whose removal increases the number of connected components using Tarjan discovery and low-link numbers.',
    pseudocode: [
      'TARJAN_AP(u, p):',
      '  tin[u] = low[u] = timer++',
      '  children = 0',
      '  for v in graph[u]:',
      '    if v == p: continue',
      '    if visited[v]: low[u] = min(low[u], tin[v])',
      '    else: children++; TARJAN_AP(v, u); low[u] = min(low[u], low[v])',
      '      if low[v] >= tin[u] and p != -1: MARK_AP(u)',
      '  if p == -1 and children > 1: MARK_AP(u)'
    ]
  },
  'Bridges': {
    name: 'Bridges (Cut Edges)',
    family: ALGORITHM_FAMILIES.GRAPHS,
    time: 'O(V + E)',
    space: 'O(V)',
    description: 'Finds critical edges whose removal disconnects the graph using DFS low-link comparisons (low[v] > tin[u]).',
    pseudocode: [
      'FIND_BRIDGES(u, p):',
      '  tin[u] = low[u] = timer++',
      '  for v in graph[u]:',
      '    if v == p: continue',
      '    if visited[v]: low[u] = min(low[u], tin[v])',
      '    else: FIND_BRIDGES(v, u); low[u] = min(low[u], low[v])',
      '      if low[v] > tin[u]: RECORD_BRIDGE(u, v)'
    ]
  },
  'A* Search': {
    name: 'A* Search Algorithm',
    family: ALGORITHM_FAMILIES.GRAPHS,
    time: 'O(E)',
    space: 'O(V)',
    description: 'Heuristic-guided shortest path search minimizing f(n) = g(n) + h(n), where g(n) is exact cost from start and h(n) is an admissible heuristic estimate to the goal.',
    pseudocode: [
      'A_STAR(start, goal, heuristic):',
      '  open_set = min_pq([(f(start), start)])',
      '  g_score = {all: infinity}; g_score[start] = 0',
      '  while open_set is not empty:',
      '    current = open_set.pop_min()',
      '    if current == goal: return reconstruct_path()',
      '    for neighbor of current:',
      '      tentative_g = g_score[current] + weight',
      '      if tentative_g < g_score[neighbor]:',
      '        g_score[neighbor] = tentative_g',
      '        f_score = tentative_g + heuristic(neighbor, goal)',
      '        open_set.push((f_score, neighbor))'
    ]
  },

  // --- GREEDY ALGORITHMS ---
  'Activity Selection': {
    name: 'Activity Selection Problem',
    family: ALGORITHM_FAMILIES.GREEDY,
    time: 'O(n log n)',
    space: 'O(1)',
    description: 'Selects the maximum number of mutually compatible activities competing for a shared resource by sorting by finish time and picking greedily.',
    pseudocode: [
      'ACTIVITY_SELECTION(activities):',
      '  sort activities by finish_time ascending',
      '  selected = [activities[0]]',
      '  last_finish = activities[0].finish',
      '  for i = 1 to n - 1:',
      '    if activities[i].start >= last_finish:',
      '      selected.append(activities[i])',
      '      last_finish = activities[i].finish',
      '  return selected'
    ]
  },
  'Fractional Knapsack': {
    name: 'Fractional Knapsack',
    family: ALGORITHM_FAMILIES.GREEDY,
    time: 'O(n log n)',
    space: 'O(1)',
    description: 'Maximizes total value in a knapsack of capacity W when items can be taken fractionally, by sorting by value-to-weight ratio.',
    pseudocode: [
      'FRACTIONAL_KNAPSACK(items, W):',
      '  sort items by (value / weight) descending',
      '  total_val = 0',
      '  for item in items:',
      '    if item.weight <= W:',
      '      total_val += item.value; W -= item.weight',
      '    else:',
      '      total_val += item.value * (W / item.weight)',
      '      break',
      '  return total_val'
    ]
  },
  'Job Sequencing with Deadlines': {
    name: 'Job Sequencing with Deadlines',
    family: ALGORITHM_FAMILIES.GREEDY,
    time: 'O(n²)',
    space: 'O(max_deadline)',
    description: 'Schedules jobs with deadlines and profits to maximize profit, slotting higher profit jobs into the latest available slot prior to their deadline.',
    pseudocode: [
      'JOB_SEQUENCING(jobs):',
      '  sort jobs by profit descending',
      '  slots = array of nulls up to max_deadline',
      '  for job in jobs:',
      '    for t = min(max_deadline, job.deadline) down to 1:',
      '      if slots[t] is free:',
      '        slots[t] = job; break'
    ]
  },
  'Huffman Coding': {
    name: 'Huffman Coding',
    family: ALGORITHM_FAMILIES.GREEDY,
    time: 'O(n log n)',
    space: 'O(n)',
    description: 'Constructs an optimal prefix code for lossless data compression by repeatedly merging the two lowest-frequency characters using a min-heap.',
    pseudocode: [
      'HUFFMAN_CODING(frequencies):',
      '  pq = min_heap_of_nodes(frequencies)',
      '  while |pq| > 1:',
      '    left = pq.extract_min()',
      '    right = pq.extract_min()',
      '    merged = Node(left.freq + right.freq, left, right)',
      '    pq.insert(merged)',
      '  return generate_codes(pq.peek())'
    ]
  },
  'Optimal Merge Pattern': {
    name: 'Optimal Merge Pattern',
    family: ALGORITHM_FAMILIES.GREEDY,
    time: 'O(n log n)',
    space: 'O(n)',
    description: 'Minimizes the cumulative cost of merging n sorted files into a single file by repeatedly merging the two smallest files.',
    pseudocode: [
      'OPTIMAL_MERGE(file_sizes):',
      '  pq = min_heap(file_sizes)',
      '  total_cost = 0',
      '  while |pq| > 1:',
      '    a = pq.extract_min()',
      '    b = pq.extract_min()',
      '    cost = a + b',
      '    total_cost += cost',
      '    pq.insert(cost)',
      '  return total_cost'
    ]
  },
  'Coin Change Greedy': {
    name: 'Coin Change (Greedy)',
    family: ALGORITHM_FAMILIES.GREEDY,
    time: 'O(n log n)',
    space: 'O(1)',
    description: 'Always takes the largest coin denomination less than or equal to the remaining amount. Note: Optimal for canonical currency (e.g. US/Euro), but fails for arbitrary coin systems (e.g. [1, 3, 4] for amount 6).',
    pseudocode: [
      'COIN_CHANGE_GREEDY(coins, amount):',
      '  sort coins descending',
      '  count = 0',
      '  for c in coins:',
      '    count += amount // c',
      '    amount %= c',
      '  return amount == 0 ? count : CANNOT_DISPENSE'
    ]
  },
  'Minimum Platforms': {
    name: 'Minimum Platforms for Railway Station',
    family: ALGORITHM_FAMILIES.GREEDY,
    time: 'O(n log n)',
    space: 'O(1)',
    description: 'Finds the minimum number of platforms required to prevent train collisions by sorting arrival and departure times and tracking peak overlap.',
    pseudocode: [
      'MIN_PLATFORMS(arr, dep):',
      '  sort(arr); sort(dep)',
      '  platforms = 0; max_platforms = 0',
      '  i = 0; j = 0',
      '  while i < length(arr):',
      '    if arr[i] <= dep[j]: platforms++; i++',
      '    else: platforms--; j++',
      '    max_platforms = max(max_platforms, platforms)',
      '  return max_platforms'
    ]
  },

  // --- DYNAMIC PROGRAMMING ---
  '0/1 Knapsack': {
    name: '0/1 Knapsack Problem',
    family: ALGORITHM_FAMILIES.DYNAMIC_PROGRAMMING,
    time: 'O(n * W)',
    space: 'O(n * W)',
    description: 'Given items with weights and values, determines the maximum value that can fit into a knapsack of capacity W without splitting items.',
    pseudocode: [
      'KNAPSACK_01(W, wt, val, n):',
      '  dp[n + 1][W + 1] = 0',
      '  for i = 1 to n:',
      '    for w = 0 to W:',
      '      if wt[i - 1] <= w:',
      '        dp[i][w] = max(val[i - 1] + dp[i - 1][w - wt[i - 1]], dp[i - 1][w])',
      '      else: dp[i][w] = dp[i - 1][w]',
      '  return dp[n][W]'
    ]
  },
  'Unbounded Knapsack': {
    name: 'Unbounded Knapsack',
    family: ALGORITHM_FAMILIES.DYNAMIC_PROGRAMMING,
    time: 'O(n * W)',
    space: 'O(W)',
    description: 'Variation where an unlimited quantity of each item is available, yielding recurrence dp[w] = max(dp[w], val[i] + dp[w - wt[i]]).',
    pseudocode: [
      'UNBOUNDED_KNAPSACK(W, wt, val):',
      '  dp = array of 0s up to W',
      '  for w = 1 to W:',
      '    for i = 0 to length(wt) - 1:',
      '      if wt[i] <= w:',
      '        dp[w] = max(dp[w], val[i] + dp[w - wt[i]])',
      '  return dp[W]'
    ]
  },
  'Coin Change DP': {
    name: 'Coin Change (Min Coins DP)',
    family: ALGORITHM_FAMILIES.DYNAMIC_PROGRAMMING,
    time: 'O(amount * coins.length)',
    space: 'O(amount)',
    description: 'Finds the minimum number of coins needed to make up a given amount using dynamic programming, handling any arbitrary coin denominations optimally.',
    pseudocode: [
      'COIN_CHANGE_DP(coins, amount):',
      '  dp = array of infinity with size amount + 1; dp[0] = 0',
      '  for i = 1 to amount:',
      '    for c in coins:',
      '      if i >= c and dp[i - c] != infinity:',
      '        dp[i] = min(dp[i], dp[i - c] + 1)',
      '  return dp[amount] == infinity ? -1 : dp[amount]'
    ]
  },
  'Longest Common Subsequence': {
    name: 'Longest Common Subsequence (LCS)',
    family: ALGORITHM_FAMILIES.DYNAMIC_PROGRAMMING,
    time: 'O(m * n)',
    space: 'O(m * n)',
    description: 'Finds the longest sequence that appears in both strings in the same relative order (not necessarily contiguous), with backtracked reconstruction.',
    pseudocode: [
      'LCS(X, Y):',
      '  m = length(X); n = length(Y)',
      '  dp[m + 1][n + 1] = 0',
      '  for i = 1 to m:',
      '    for j = 1 to n:',
      '      if X[i - 1] == Y[j - 1]: dp[i][j] = dp[i - 1][j - 1] + 1',
      '      else: dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])',
      '  return dp[m][n]'
    ]
  },
  'Longest Common Substring': {
    name: 'Longest Common Substring',
    family: ALGORITHM_FAMILIES.DYNAMIC_PROGRAMMING,
    time: 'O(m * n)',
    space: 'O(m * n)',
    description: 'Finds the longest contiguous string common to two strings; cells reset to 0 on character mismatch.',
    pseudocode: [
      'LC_SUBSTRING(X, Y):',
      '  dp[m + 1][n + 1] = 0; max_len = 0',
      '  for i = 1 to m:',
      '    for j = 1 to n:',
      '      if X[i - 1] == Y[j - 1]:',
      '        dp[i][j] = dp[i - 1][j - 1] + 1',
      '        max_len = max(max_len, dp[i][j])',
      '      else: dp[i][j] = 0',
      '  return max_len'
    ]
  },
  'Longest Increasing Subsequence': {
    name: 'Longest Increasing Subsequence (LIS)',
    family: ALGORITHM_FAMILIES.DYNAMIC_PROGRAMMING,
    time: 'O(n²)',
    space: 'O(n)',
    description: 'Finds the length of the longest subsequence of a given sequence in which the elements are in strictly increasing order.',
    pseudocode: [
      'LIS(A):',
      '  dp = array of 1s of size length(A)',
      '  for i = 1 to length(A) - 1:',
      '    for j = 0 to i - 1:',
      '      if A[j] < A[i]:',
      '        dp[i] = max(dp[i], dp[j] + 1)',
      '  return max(dp)'
    ]
  },
  'Matrix Chain Multiplication': {
    name: 'Matrix Chain Multiplication',
    family: ALGORITHM_FAMILIES.DYNAMIC_PROGRAMMING,
    time: 'O(n³)',
    space: 'O(n²)',
    description: 'Finds the most efficient parenthesization to multiply a given sequence of matrices using memoized subchain splits.',
    pseudocode: [
      'MCM(p):',
      '  n = length(p) - 1',
      '  m[n + 1][n + 1] = 0',
      '  for L = 2 to n:',
      '    for i = 1 to n - L + 1:',
      '      j = i + L - 1; m[i][j] = infinity',
      '      for k = i to j - 1:',
      '        q = m[i][k] + m[k + 1][j] + p[i - 1] * p[k] * p[j]',
      '        if q < m[i][j]: m[i][j] = q'
    ]
  },
  'Rod Cutting': {
    name: 'Rod Cutting Problem',
    family: ALGORITHM_FAMILIES.DYNAMIC_PROGRAMMING,
    time: 'O(n²)',
    space: 'O(n)',
    description: 'Determines the maximum revenue obtainable by cutting a rod of length n into pieces with given price values.',
    pseudocode: [
      'ROD_CUTTING(price, n):',
      '  val = array of 0s of size n + 1',
      '  for i = 1 to n:',
      '    max_val = -infinity',
      '    for j = 0 to i - 1:',
      '      max_val = max(max_val, price[j] + val[i - j - 1])',
      '    val[i] = max_val',
      '  return val[n]'
    ]
  },
  'Fibonacci DP': {
    name: 'Fibonacci using Dynamic Programming',
    family: ALGORITHM_FAMILIES.DYNAMIC_PROGRAMMING,
    time: 'O(n)',
    space: 'O(n)',
    description: 'Demonstrates tabulation vs memoization, showing how DP turns an exponential O(2ⁿ) recursion into an efficient linear O(n) scan.',
    pseudocode: [
      'FIBONACCI_DP(n):',
      '  if n <= 1: return n',
      '  dp = [0, 1]',
      '  for i = 2 to n:',
      '    dp[i] = dp[i - 1] + dp[i - 2]',
      '  return dp[n]'
    ]
  },
  'Edit Distance': {
    name: 'Edit Distance (Levenshtein Distance)',
    family: ALGORITHM_FAMILIES.DYNAMIC_PROGRAMMING,
    time: 'O(m * n)',
    space: 'O(m * n)',
    description: 'Calculates the minimum number of single-character edits (insertions, deletions, or substitutions) required to transform word1 into word2.',
    pseudocode: [
      'EDIT_DISTANCE(word1, word2):',
      '  m = length(word1); n = length(word2)',
      '  dp[m + 1][n + 1]',
      '  for i = 0 to m: dp[i][0] = i',
      '  for j = 0 to n: dp[0][j] = j',
      '  for i = 1 to m:',
      '    for j = 1 to n:',
      '      if word1[i - 1] == word2[j - 1]: dp[i][j] = dp[i - 1][j - 1]',
      '      else: dp[i][j] = 1 + min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1])',
      '  return dp[m][n]'
    ]
  },
  'Subset Sum': {
    name: 'Subset Sum Problem',
    family: ALGORITHM_FAMILIES.DYNAMIC_PROGRAMMING,
    time: 'O(n * sum)',
    space: 'O(n * sum)',
    description: 'Decides whether there exists a subset of the given numbers with a sum equal to a target value.',
    pseudocode: [
      'SUBSET_SUM(arr, target):',
      '  dp[n + 1][target + 1] = false',
      '  for i = 0 to n: dp[i][0] = true',
      '  for i = 1 to n:',
      '    for s = 1 to target:',
      '      if arr[i - 1] <= s:',
      '        dp[i][s] = dp[i - 1][s] or dp[i - 1][s - arr[i - 1]]',
      '      else: dp[i][s] = dp[i - 1][s]',
      '  return dp[n][target]'
    ]
  },
  'Minimum Path Sum': {
    name: 'Minimum Path Sum in Grid',
    family: ALGORITHM_FAMILIES.DYNAMIC_PROGRAMMING,
    time: 'O(m * n)',
    space: 'O(m * n)',
    description: 'Finds a path from top-left to bottom-right of a grid minimizing the sum of all numbers along its path (moving only down or right).',
    pseudocode: [
      'MIN_PATH_SUM(grid):',
      '  dp[m][n]',
      '  dp[0][0] = grid[0][0]',
      '  fill first row: dp[0][c] = dp[0][c - 1] + grid[0][c]',
      '  fill first col: dp[r][0] = dp[r - 1][0] + grid[r][0]',
      '  for r = 1 to m - 1:',
      '    for c = 1 to n - 1:',
      '      dp[r][c] = grid[r][c] + min(dp[r - 1][c], dp[r][c - 1])',
      '  return dp[m - 1][n - 1]'
    ]
  },
  'Floyd-Warshall DP': {
    name: 'Floyd-Warshall (DP All-Pairs Shortest Path)',
    family: ALGORITHM_FAMILIES.DYNAMIC_PROGRAMMING,
    time: 'O(V³)',
    space: 'O(V²)',
    description: 'DP formulation computing all-pairs shortest paths through intermediate vertices k: d[i][j] = min(d[i][j], d[i][k] + d[k][j]).',
    pseudocode: [
      'FLOYD_WARSHALL_DP(d, V):',
      '  for k = 0 to V - 1:',
      '    for i = 0 to V - 1:',
      '      for j = 0 to V - 1:',
      '        d[i][j] = min(d[i][j], d[i][k] + d[k][j])'
    ]
  },
  'Travelling Salesman DP': {
    name: 'Travelling Salesman Problem (Bitmask DP)',
    family: ALGORITHM_FAMILIES.DYNAMIC_PROGRAMMING,
    time: 'O(2ⁿ * n²)',
    space: 'O(2ⁿ * n)',
    description: 'Computes the minimum cost Hamiltonian cycle in a weighted complete graph using Bellman-Held-Karp bitmask DP, where states are (mask, current_city).',
    pseudocode: [
      'TSP_HELD_KARP(dist, n):',
      '  dp[1 << n][n] = infinity',
      '  dp[1][0] = 0',
      '  for mask = 1 to (1 << n) - 1:',
      '    for u = 0 to n - 1:',
      '      if not (mask & (1 << u)): continue',
      '      for v = 0 to n - 1:',
      '        if mask & (1 << v): continue',
      '        next_mask = mask | (1 << v)',
      '        dp[next_mask][v] = min(dp[next_mask][v], dp[mask][u] + dist[u][v])',
      '  return min_v(dp[(1 << n) - 1][v] + dist[v][0])'
    ]
  },

  // --- BACKTRACKING ---
  'N-Queens': {
    name: 'N-Queens Problem',
    family: ALGORITHM_FAMILIES.BACKTRACKING,
    time: 'O(N!)',
    space: 'O(N)',
    description: 'Places N non-attacking queens on an N×N chessboard such that no two queens share the same row, column, or diagonal.',
    pseudocode: [
      'SOLVE_N_QUEENS(row, n):',
      '  if row == n: RECORD_SOLUTION(); return true',
      '  for col = 0 to n - 1:',
      '    if IS_SAFE(row, col):',
      '      place queen at (row, col)',
      '      SOLVE_N_QUEENS(row + 1, n)',
      '      remove queen (backtrack)'
    ]
  },
  'Rat in a Maze': {
    name: 'Rat in a Maze',
    family: ALGORITHM_FAMILIES.BACKTRACKING,
    time: 'O(2^(n²))',
    space: 'O(n²)',
    description: 'A rat starts at (0, 0) and attempts to reach destination (N-1, N-1) navigating through a maze with open cells and obstacles.',
    pseudocode: [
      'SOLVE_MAZE(r, c):',
      '  if r == n - 1 and c == n - 1: return true',
      '  if IS_VALID(r, c):',
      '    mark path[r][c] = 1',
      '    for each direction (D, R, U, L):',
      '      if SOLVE_MAZE(r + dr, c + dc): return true',
      '    unmark path[r][c] = 0 (backtrack)',
      '  return false'
    ]
  },
  'Sudoku Solver': {
    name: 'Sudoku Solver',
    family: ALGORITHM_FAMILIES.BACKTRACKING,
    time: 'O(9^(n²))',
    space: 'O(n²)',
    description: 'Fills a grid with digits 1–9 (or 1–4 for mini grid) such that every row, column, and subgrid contains all digits without repetition, backtracking upon conflict.',
    pseudocode: [
      'SOLVE_SUDOKU(board):',
      '  (row, col) = find_empty_cell(board)',
      '  if no empty cell: return true',
      '  for num = 1 to 9:',
      '    if IS_VALID(board, row, col, num):',
      '      board[row][col] = num',
      '      if SOLVE_SUDOKU(board): return true',
      '      board[row][col] = 0 (backtrack)',
      '  return false'
    ]
  },
  'Graph Coloring': {
    name: 'Graph Coloring (M-Coloring)',
    family: ALGORITHM_FAMILIES.BACKTRACKING,
    time: 'O(M^V)',
    space: 'O(V)',
    description: 'Assigns one of M colors to each vertex of a graph such that no two adjacent vertices have the same color.',
    pseudocode: [
      'COLOR_GRAPH(v, m):',
      '  if v == |V|: return true',
      '  for color = 1 to m:',
      '    if IS_SAFE(v, color):',
      '      assigned[v] = color',
      '      if COLOR_GRAPH(v + 1, m): return true',
      '      assigned[v] = 0 (backtrack)',
      '  return false'
    ]
  },
  'Hamiltonian Cycle': {
    name: 'Hamiltonian Cycle',
    family: ALGORITHM_FAMILIES.BACKTRACKING,
    time: 'O(N!)',
    space: 'O(N)',
    description: 'Finds a closed loop on a graph that visits every vertex exactly once and returns to the initial vertex.',
    pseudocode: [
      'HAM_CYCLE(pos):',
      '  if pos == |V|:',
      '    return has_edge(path[pos - 1], path[0])',
      '  for v = 1 to |V| - 1:',
      '    if IS_SAFE(v, pos):',
      '      path[pos] = v',
      '      if HAM_CYCLE(pos + 1): return true',
      '      path[pos] = -1 (backtrack)',
      '  return false'
    ]
  },
  'Sum of Subsets': {
    name: 'Sum of Subsets',
    family: ALGORITHM_FAMILIES.BACKTRACKING,
    time: 'O(2ⁿ)',
    space: 'O(n)',
    description: 'Explores an inclusion/exclusion decision tree to find subsets of numbers that sum to a given target, pruning branches where current sum exceeds target.',
    pseudocode: [
      'SUBSET_SUM_BT(idx, current_sum, target):',
      '  if current_sum == target: RECORD_SOLUTION(); return',
      '  if idx == n or current_sum > target: return',
      '  // Include element',
      '  SUBSET_SUM_BT(idx + 1, current_sum + arr[idx], target)',
      '  // Exclude element (backtrack)',
      '  SUBSET_SUM_BT(idx + 1, current_sum, target)'
    ]
  },
  'Permutations': {
    name: 'String / Array Permutations',
    family: ALGORITHM_FAMILIES.BACKTRACKING,
    time: 'O(N * N!)',
    space: 'O(N)',
    description: 'Generates all permutations of a collection by swapping elements at each index and backtracking to restore order.',
    pseudocode: [
      'PERMUTE(A, l, r):',
      '  if l == r: RECORD(A); return',
      '  for i = l to r:',
      '    swap(A[l], A[i])',
      '    PERMUTE(A, l + 1, r)',
      '    swap(A[l], A[i]) // backtrack'
    ]
  },
  'TSP Backtracking': {
    name: 'Travelling Salesman (Backtracking)',
    family: ALGORITHM_FAMILIES.BACKTRACKING,
    time: 'O((N - 1)!)',
    space: 'O(N)',
    description: 'Exhaustively explores all permutations of city visits with branch-and-bound pruning to find the shortest tour visiting all cities and returning to start.',
    pseudocode: [
      'TSP_BT(current_city, count, cost):',
      '  if count == n and dist[current_city][0] > 0:',
      '    min_cost = min(min_cost, cost + dist[current_city][0])',
      '    return',
      '  for next = 0 to n - 1:',
      '    if not visited[next] and dist[current_city][next] > 0:',
      '      if cost + dist[current_city][next] < min_cost: // prune',
      '        visited[next] = true',
      '        TSP_BT(next, count + 1, cost + dist[current_city][next])',
      '        visited[next] = false'
    ]
  }
};
