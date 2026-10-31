// AlgoArena Structured Practice & Quiz Question Bank
// Academically verified questions, difficulty classifications, and pedagogical explanations

export const QUIZ_QUESTIONS = [
  // --- SORTING ---
  {
    id: 'sort-1',
    topic: 'Sorting',
    difficulty: 'Easy',
    question: 'Which sorting algorithm has a worst-case time complexity of O(n log n) while maintaining stability and requiring O(n) auxiliary space?',
    options: ['Quick Sort', 'Merge Sort', 'Heap Sort', 'Selection Sort'],
    answerIndex: 1,
    explanation: 'Merge Sort consistently achieves O(n log n) in best, average, and worst cases through divide-and-conquer, preserves relative order of equal keys (stable), but requires O(n) auxiliary memory for the merge buffer.'
  },
  {
    id: 'sort-2',
    topic: 'Sorting',
    difficulty: 'Medium',
    question: 'In Quick Sort with Lomuto partitioning, what triggers the worst-case O(n²) runtime if the last element is always chosen as pivot?',
    options: [
      'Input array is completely random',
      'Input array is already sorted in ascending or descending order',
      'Input array has all distinct elements',
      'Input array size is a power of 2'
    ],
    answerIndex: 1,
    explanation: 'When the array is already sorted, picking the last element as pivot produces severely unbalanced partitions of size 0 and n - 1 at every recursion level, leading to an arithmetic series of comparisons: (n - 1) + (n - 2) + ... + 1 = O(n²).'
  },
  {
    id: 'sort-3',
    topic: 'Sorting',
    difficulty: 'Hard',
    question: 'Why does Counting Sort fail to achieve O(n) runtime when sorting an array of 10 integers where the maximum value is 1,000,000,000?',
    options: [
      'Counting sort requires comparison between elements',
      'The time complexity is O(n + k); here range k = 10⁹ vastly dominates n',
      'Counting sort only works on powers of two',
      'The recursion depth exceeds stack limits'
    ],
    answerIndex: 1,
    explanation: 'Counting sort runs in O(n + k) time and O(k) space, where k is the range (max - min + 1). When k = 10⁹ and n = 10, creating and iterating over a frequency array of 1 billion entries requires prohibitive time and memory.'
  },
  {
    id: 'sort-4',
    topic: 'Sorting',
    difficulty: 'Medium',
    question: 'Which of the following sorting algorithms makes the minimum number of array write (swap) operations in the worst case?',
    options: ['Bubble Sort', 'Insertion Sort', 'Selection Sort', 'Merge Sort'],
    answerIndex: 2,
    explanation: 'Selection Sort performs at most n - 1 swaps in total, making it optimal for memory devices (such as EEPROM/Flash) where write cycles degrade the hardware.'
  },

  // --- SEARCHING ---
  {
    id: 'search-1',
    topic: 'Searching',
    difficulty: 'Easy',
    question: 'What is the primary prerequisite for applying Binary Search to an array?',
    options: [
      'Array must contain unique elements only',
      'Array elements must be sorted in monotonic order',
      'Array length must be an even number',
      'Array elements must be non-negative integers'
    ],
    answerIndex: 1,
    explanation: 'Binary Search relies on monotonicity (sorted order) to determine whether the target lies in the left or right partition by evaluating the midpoint.'
  },
  {
    id: 'search-2',
    topic: 'Searching',
    difficulty: 'Medium',
    question: 'Under what specific condition does Interpolation Search achieve an average time complexity of O(log log n)?',
    options: [
      'The array is sorted and reverse ordered',
      'The array is sorted and values are uniformly distributed',
      'The target is located at index 0',
      'The array has exponential growth'
    ],
    answerIndex: 1,
    explanation: 'Interpolation Search uses a linear interpolation formula to probe where the key is expected to lie. When the elements are uniformly distributed across the range, it converges in O(log log n) comparisons. If distribution is highly skewed, it can degrade to O(n).'
  },
  {
    id: 'search-3',
    topic: 'Searching',
    difficulty: 'Hard',
    question: 'In Jump Search on an array of size n, why is the optimal block jump step size chosen as m = √n?',
    options: [
      'It minimizes the total operations (n/m jumps + m linear scans)',
      'Because square root is the reciprocal of logarithm',
      'To prevent memory cache misses',
      'To ensure all jumps land on power-of-two addresses'
    ],
    answerIndex: 0,
    explanation: 'The worst-case number of comparisons is (n/m) + (m - 1). Taking the derivative with respect to m and equating to zero: d/dm (n/m + m) = -n/m² + 1 = 0 => m² = n => m = √n.'
  },

  // --- DATA STRUCTURES ---
  {
    id: 'ds-1',
    topic: 'Data Structures',
    difficulty: 'Easy',
    question: 'In a fixed-size Circular Queue of capacity N implemented using an array, what condition correctly indicates that the queue is FULL?',
    options: [
      'front == rear',
      '(rear + 1) % N == front',
      'rear == N - 1',
      'front == 0'
    ],
    answerIndex: 1,
    explanation: 'In a circular queue with one slot left open to distinguish between full and empty states, (rear + 1) % N == front means advancing rear by one would collide with front, hence the queue is full.'
  },
  {
    id: 'ds-2',
    topic: 'Data Structures',
    difficulty: 'Medium',
    question: 'When deleting a node with two children from a Binary Search Tree (BST), what replacement node maintains the BST invariant?',
    options: [
      'The root of the tree',
      'The inorder successor (minimum of right subtree) or inorder predecessor (maximum of left subtree)',
      'The rightmost child of the right subtree',
      'Any leaf node selected at random'
    ],
    answerIndex: 1,
    explanation: 'The inorder successor is the smallest key strictly greater than the deleted node, while the predecessor is the greatest key strictly smaller. Replacing the deleted node with either maintains the BST property for both subtrees.'
  },
  {
    id: 'ds-3',
    topic: 'Data Structures',
    difficulty: 'Hard',
    question: 'In an AVL Tree, after inserting a node into the left subtree of the right child of an unbalanced node, which rotation restores balance?',
    options: ['Single Left (LL) rotation', 'Single Right (RR) rotation', 'Right-Left (RL) double rotation', 'Left-Right (LR) double rotation'],
    answerIndex: 2,
    explanation: 'This case is designated as the Right-Left (RL) imbalance. It requires first a Right rotation on the right child, followed by a Left rotation on the unbalanced parent node.'
  },

  // --- GRAPH ALGORITHMS ---
  {
    id: 'graph-1',
    topic: 'Graph Algorithms',
    difficulty: 'Easy',
    question: "Why does Dijkstra's algorithm fail to produce correct shortest paths on graphs containing negative edge weights?",
    options: [
      'Priority queue cannot store negative numbers',
      "Dijkstra greedily assumes once a vertex's distance is finalized from the priority queue, no subsequent shorter path to it exists",
      'Graph traversal hangs in an infinite recursion',
      'Adjacency lists cannot store negative values'
    ],
    answerIndex: 1,
    explanation: "Dijkstra's greedy paradigm assumes that adding non-negative edge weights will only increase path lengths. A negative edge can retroactively decrease the cost of an already 'finalized' vertex, violating Dijkstra's optimality guarantee."
  },
  {
    id: 'graph-2',
    topic: 'Graph Algorithms',
    difficulty: 'Medium',
    question: 'Which algorithm finds all-pairs shortest paths in O(V³) time using Dynamic Programming?',
    options: ['Prim', 'Kruskal', 'Floyd-Warshall', 'Kosaraju'],
    answerIndex: 2,
    explanation: 'The Floyd-Warshall algorithm uses dynamic programming across intermediate vertices k: d[i][j] = min(d[i][j], d[i][k] + d[k][j]), computing all-pairs shortest paths in O(V³) time.'
  },
  {
    id: 'graph-3',
    topic: 'Graph Algorithms',
    difficulty: 'Hard',
    question: 'In a graph with |V| vertices, Bellman-Ford relaxes all edges |V| - 1 times. What does it indicate if an edge relaxes on the |V|-th iteration?',
    options: [
      'The graph is a DAG',
      'The graph contains a reachable negative weight cycle',
      'The graph is bipartite',
      'The graph is an undirected tree'
    ],
    answerIndex: 1,
    explanation: 'A simple shortest path in a graph with |V| vertices can contain at most |V| - 1 edges. If distances continue to decrease on the |V|-th pass, a negative weight cycle exists that can be traversed indefinitely to reduce path cost toward negative infinity.'
  },

  // --- DYNAMIC PROGRAMMING ---
  {
    id: 'dp-1',
    topic: 'Dynamic Programming',
    difficulty: 'Easy',
    question: 'What two fundamental properties must a problem exhibit to be effectively solved by Dynamic Programming?',
    options: [
      'Deterministic output and memory safety',
      'Optimal substructure and overlapping subproblems',
      'Greedy choice property and sorted input',
      'Linear time complexity and binary branching'
    ],
    answerIndex: 1,
    explanation: 'Dynamic Programming applies when an optimal solution to the problem contains optimal solutions to its subproblems (optimal substructure) and the recursive solution visits the exact same subproblems repeatedly (overlapping subproblems).'
  },
  {
    id: 'dp-2',
    topic: 'Dynamic Programming',
    difficulty: 'Medium',
    question: 'In the 0/1 Knapsack problem with items weights wt[] and values val[], what is the recurrence relation for dp[i][w]?',
    options: [
      'dp[i][w] = dp[i-1][w] + val[i-1]',
      'dp[i][w] = max(dp[i-1][w], val[i-1] + dp[i-1][w - wt[i-1]]) when wt[i-1] <= w',
      'dp[i][w] = min(dp[i-1][w], dp[i][w - 1])',
      'dp[i][w] = val[i-1] * wt[i-1]'
    ],
    answerIndex: 1,
    explanation: 'For each item i, we decide whether to exclude it (yielding dp[i-1][w]) or include it (yielding val[i-1] + dp[i-1][w - wt[i-1]]), taking the maximum of the two choices.'
  },

  // --- GREEDY & BACKTRACKING ---
  {
    id: 'greedy-1',
    topic: 'Greedy Algorithms',
    difficulty: 'Medium',
    question: 'Why does the greedy strategy for Coin Change (picking largest denomination first) fail to find the minimum coins for coins = [1, 3, 4] and target amount = 6?',
    options: [
      'Greedy produces 4 + 1 + 1 (3 coins), whereas the optimal solution is 3 + 3 (2 coins)',
      'Greedy fails to terminate on even numbers',
      'Greedy coin change has O(2ⁿ) complexity',
      'Coin denominations must be prime numbers'
    ],
    answerIndex: 0,
    explanation: 'Greedy greedily picks 4 first, leaving 2, which requires two 1s: total 3 coins (4, 1, 1). However, the optimal answer uses two 3s (3 + 3 = 6), using only 2 coins. This proves greedy choice is not universally optimal for non-canonical denominations.'
  },
  {
    id: 'bt-1',
    topic: 'Backtracking',
    difficulty: 'Medium',
    question: 'In the classic N-Queens problem on an N×N board, how do we efficiently check in O(1) if placing a queen at (row, col) conflicts along diagonals?',
    options: [
      'Scan the entire board matrix from (0,0) to (N-1, N-1)',
      'Track occupied primary diagonals (row - col) and anti-diagonals (row + col) in boolean arrays or sets',
      'Check if row and col are both prime numbers',
      'Calculate the determinant of the board'
    ],
    answerIndex: 1,
    explanation: 'Along any primary diagonal (\\), the difference (row - col) is invariant. Along any secondary diagonal (/), the sum (row + col) is invariant. Storing these in lookup sets provides O(1) safety checks.'
  }
];
