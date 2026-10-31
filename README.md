# AlgoArena — Interactive Data Structures & Algorithms Learning Platform

> **Tagline:** *Understand the logic. Visualize every step. Master every algorithm.*

AlgoArena is an interactive computer science laboratory and educational workbench designed for computer engineering students, technical interviewees, and DSA enthusiasts. It transforms abstract asymptotic notations and algorithmic mechanics into tangible, step-by-step visual execution traces, real-time memory mutations, and synchronized pseudocode executions.

---

## 1. Problem Statement & Educational Need
Traditional DSA pedagogy often relies on static textbook diagrams, memorization of Big-O notations, and pre-baked demonstration loops that fail to explain *why* an algorithm behaves as it does on arbitrary inputs. Students struggle to develop rigorous mental models for:
- How partitioning in Quick Sort or merging in Merge Sort shifts pointers in real-time.
- Why Dijkstra's greedy invariant fails on negative edge weights, while Bellman-Ford can detect negative cycles.
- How balance factors and rotations restore AVL Tree height invariants.
- How dynamic programming memoization tables are populated cell-by-cell and reconstructed via backtracking.
- Why greedy currency exchange produces sub-optimal outputs on non-canonical coin denominations.

AlgoArena addresses these hurdles through deterministic client-side execution traces, user-configurable custom datasets, and pedagogical walkthroughs.

---

## 2. Project Architecture

The platform follows a decoupled, deterministic state engine architecture where algorithm computation is completely separated from React rendering components:

```text
src/
├── main.jsx                            # Application root workbench & route controller
├── style.css                           # Global design system & typography tokens
│
├── core/
│   ├── engine/                         # Playback timeline & trace generation abstractions
│   └── storage/
│       └── progressStorage.js          # Versioned LocalStorage manager (recents, bookmarks, quizzes)
│
├── data/
│   ├── algorithms.js                   # Comprehensive metadata, Big-O tables, pseudocode for all algorithms
│   ├── defaultInputs.js                # Preset arrays, sample graphs (DAG, Negative weights), DP samples
│   └── quizQuestions.js                # Academic question bank across all DSA topics with explanations
│
├── algorithms/
│   ├── sorting/sortingTraces.js        # Bubble, Selection, Insertion, Merge, Quick, Heap, Shell, Counting, Radix, Bucket
│   ├── searching/searchingTraces.js    # Linear, Binary, Jump, Interpolation, Exponential
│   ├── graphs/graphTraces.js           # 15 Graph algorithms (Dijkstra, Bellman-Ford, Prim, Kruskal, A*, Kosaraju...)
│   ├── greedy/greedyTraces.js          # Activity Selection, Fractional Knapsack, Job Sequencing, Minimum Platforms...
│   ├── dynamic-programming/dpTraces.js # Knapsack 0/1, LCS, Coin Change, Edit Distance, Min Path Sum...
│   └── backtracking/backtrackingTraces.js # N-Queens, Rat in a Maze, Sudoku Solver
│
├── data-structures/
│   └── dataStructuresEngine.js         # Interactive Array, Stack, Queue, Circular Queue, Deque, Linked Lists, BST, AVL, Heaps, Hash Tables
│
├── components/
│   ├── common/                         # Sidebar, Topbar, SearchModal, PlaybackControls, PseudocodeViewer, ComplexityCard
│   ├── visualizations/                 # ArrayVisualizer, GraphEditorCanvas, TreeVisualizer, StructureVisualizers, TableVisualizer, GridVisualizer, ComplexityChart
│   └── modules/                        # Dashboard, DataStructures, Graphs, Greedy, DynamicProgramming, Backtracking, Comparison, Quiz, Progress
│
└── tests/                              # Automated Vitest test suites
```

---

## 3. Implemented Modules & Supported Algorithms

### Module A: Dashboard & Analytics
- Overview of all 40+ available algorithms and 12 interactive data structures.
- Quick navigation chips for recently explored modules.
- Daily practice challenge launcher.
- Live test passing status (90+ automated tests verified).

### Module B: Sorting Algorithms (10 Algorithms)
1. **Bubble Sort**: Adjacent swaps with adaptive early-termination flag.
2. **Selection Sort**: Greedy minimum selection minimizing array writes (at most $n - 1$ swaps).
3. **Insertion Sort**: Adaptive $O(n)$ sorted prefix expansion.
4. **Merge Sort**: Divide-and-conquer with recursive merge buffer synchronization.
5. **Quick Sort**: In-place Lomuto partitioning with dynamic pivot placement.
6. **Heap Sort**: In-place Max-Heap construction and successive root extraction.
7. **Shell Sort**: Diminishing gap sequences ($h = \lfloor n/2 \rfloor, \dots, 1$).
8. **Counting Sort**: Non-comparison integer sorting using frequency prefix sums.
9. **Radix Sort**: Least Significant Digit (LSD base-10) multi-pass digit buckets.
10. **Bucket Sort**: Scatter-gather uniform distribution sorting with insertion sort subroutines.

*Features:* Custom user arrays, duplicate handling, negative integer handling, operation counters (comparisons, memory swaps), and synchronized pseudocode highlighting.

### Module C: Searching Algorithms (5 Algorithms)
1. **Linear Search**: Sequential scan preserving original input order without silent pre-sorting.
2. **Binary Search**: Monotonic range halving $[low, mid, high]$ with explicit unsorted warnings.
3. **Jump Search**: Optimal block leaping ($m = \lfloor \sqrt{n} \rfloor$) followed by local linear scans.
4. **Interpolation Search**: Linear probe estimation formula:
   $$\text{pos} = \text{low} + \left\lfloor \frac{\text{target} - A[\text{low}]}{A[\text{high}] - A[\text{low}]} \cdot (\text{high} - \text{low}) \right\rfloor$$
5. **Exponential Search**: Range identification via power-of-two doubling ($2^k$) followed by binary search.

### Module D: Interactive Data Structures Laboratory (12 Structures)
- **Array**: Insert, Delete, Update, Search, Access by index, and Capacity limits.
- **Stack (LIFO)**: Push, Pop, Peek, Top indicator, Stack Overflow and Underflow detection.
- **Queue (FIFO)**: Enqueue at Rear, Dequeue from Front, Queue Full and Underflow conditions.
- **Circular Queue**: Modulo ring indexing $(rear + 1) \pmod N$ with wraparound visual buffer.
- **Double-Ended Queue (Deque)**: Front and Rear insertions and deletions.
- **Linked Lists**: Singly, Doubly, and Circular Linked Lists with node insertion (head, tail, position), deletion by value or index, and in-place reversal.
- **Binary Search Tree (BST)**: Insert, Search path, Delete with 2-child inorder successor replacement, Inorder, Preorder, Postorder, and Level-Order traversals.
- **AVL Tree (Self-Balancing BST)**: Dynamic height tracking, balance factor calculations, and automated LL, RR, LR, and RL rotations.
- **Heaps**: Min-Heap and Max-Heap with upward sift-up insertion and downward sift-down root extraction.
- **Hash Table**: Modulo hashing with configurable collision resolution: Separate Chaining, Linear Probing, Quadratic Probing, and Double Hashing (with deleted tombstone handling).

### Module E: Dynamic Graph Laboratory (15 Algorithms)
- **Interactive SVG Graph Editor**: Click to add vertices, click pairs to connect edges, draggable vertices, toggle directed/undirected, customize edge weights, and choose starting vertices.
- **Algorithms:**
  1. Breadth-First Search (BFS)
  2. Depth-First Search (DFS)
  3. Dijkstra's Algorithm (strictly validates and rejects negative edge weights)
  4. Bellman-Ford Algorithm (relaxes $|V| - 1$ times and detects negative weight cycles)
  5. Floyd-Warshall All-Pairs Shortest Path (intermediate vertex $k$ dynamic programming matrix)
  6. Prim's Minimum Spanning Tree (handles disconnected graphs via Spanning Forests)
  7. Kruskal's MST (Disjoint Set Union cycle prevention)
  8. Topological Sort (Kahn's in-degree queue; detects and rejects non-DAG cycles)
  9. Cycle Detection (Directed 3-color recursion stack & Undirected DFS parent checks)
  10. Connected Components
  11. Strongly Connected Components (Kosaraju's 2-pass transpose algorithm)
  12. Bipartite Graph Checking (2-coloring BFS/DFS with odd-cycle conflict detection)
  13. Articulation Points (Tarjan's discovery times $tin[u]$ and low-links $low[u]$)
  14. Bridges / Cut-Edges ($low[v] > tin[u]$ critical edge isolation)
  15. A* Search (admissible Euclidean heuristic guiding optimal pathfinding)

### Module F: Greedy Algorithms (7 Algorithms)
1. **Activity Selection**: Non-overlapping interval maximization sorted by finish time.
2. **Fractional Knapsack**: Greedy value-to-weight density selection with fractional cuts.
3. **Job Sequencing with Deadlines**: Deadline slot reservation maximizing cumulative profit.
4. **Huffman Coding**: Optimal prefix coding via frequency min-heaps.
5. **Optimal Merge Pattern**: Minimum file merge cost reduction.
6. **Coin Change (Greedy)**: Explains greedy choice and provides pedagogical counterexamples (e.g., coins $[1, 3, 4]$ for amount 6) showing why greedy is not universally optimal for non-canonical denominations.
7. **Minimum Platforms**: Arrival and departure overlap tracking.

### Module G: Dynamic Programming (14 Algorithms)
- Features interactive 2D memoization tables, active cell calculation highlights, referenced subproblems, and optimal solution backtracking.
- Implementations include: **0/1 Knapsack**, **Unbounded Knapsack**, **Coin Change DP**, **Longest Common Subsequence (LCS)**, **Longest Common Substring**, **Longest Increasing Subsequence (LIS)**, **Matrix Chain Multiplication**, **Rod Cutting**, **Fibonacci DP**, **Edit Distance (Levenshtein)**, **Subset Sum**, **Minimum Path Sum in Grid**, **Floyd-Warshall DP**, and **TSP with Bitmask DP**.

### Module H: Backtracking Algorithms (8 Algorithms)
- Display search state, conflict detection, and prune backtracking:
  1. **N-Queens**: Safe placement on $N \times N$ chessboard with diagonal checks.
  2. **Rat in a Maze**: Grid obstacle avoidance and dead-end backtracking.
  3. **Sudoku Solver**: Constraint satisfaction across rows, columns, and $2 \times 2$ boxes.
  4. **Graph Coloring**, **Hamiltonian Cycle**, **Sum of Subsets**, **Permutations**, and **TSP Backtracking**.

### Module I: Algorithm Comparison Studio
- Side-by-side synchronized execution of compatible algorithm pairs (e.g. Merge Sort vs. Quick Sort, Linear Search vs. Binary Search, BFS vs. DFS).
- Identical input instance across both engines.
- Synchronized speed controls and timeline scrubber.
- Real-time comparison of comparisons, swaps/writes, and execution time (with caveats regarding hardware and runtime variances versus asymptotic order).

### Module J & K: Complexity Analysis Laboratory
- Interactive asymptotic curve graph comparing $O(1), O(\log n), O(n), O(n \log n), O(n^2), O(2^n)$.
- Interactive input size slider $n \in [2, 50]$.
- Academic distinctions between asymptotic worst-case bounds and machine wall-clock runtimes.

### Module L & M: Practice Center & Progress Tracking
- Topic-wise multiple-choice question bank (Easy, Medium, Hard).
- Instant pedagogical explanations for correct and incorrect answers.
- Persistent local progress storage (LocalStorage): saves bookmarked algorithms, recently visited topics, quiz scores, and reset history options.

### Module N: Global Search & Navigation
- Quick search command palette triggered via `Ctrl + K` or search bar.
- Collapsible sidebar with active indicators and responsive layout.

---

## 4. Technology Stack
- **Frontend Framework:** React 18
- **Build Tool:** Vite 5
- **Icons:** Lucide React
- **Styling:** Vanilla CSS with custom paper workbench tokens
- **Typography:** Space Grotesk (Headings), DM Sans (Body), DM Mono (Code & Metrics)
- **Testing Suite:** Vitest 2.1.9

---

## 5. Local Setup & Execution

### Prerequisites
- Node.js 18+ installed on your machine.

### Installation
1. Clone or extract the `AlgoArena` repository:
   ```bash
   cd AlgoArena
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

### Running the Development Server
```bash
npm run dev
```
Open your browser at `http://localhost:5173`.

### Running Automated Unit Tests
```bash
npm test
```
Runs the full Vitest automated test suite covering all sorting, searching, graph, data structure, greedy, dynamic programming, and backtracking algorithms.

### Production Build
```bash
npm run build
npm run preview
```

---

## 6. Test Suite Coverage Summary

All algorithm traces and operations are backed by automated tests:
- **`src/tests/sorting_searching.test.js`**: 59 passing tests (empty arrays, single elements, reversed, duplicates, negative numbers, 10 sorting algorithms, 5 searching algorithms, monotonic boundary checks).
- **`src/tests/data_structures.test.js`**: 11 passing tests (stack overflow/underflow, queue FIFO, circular queue modulo wraparound, deque operations, linked list edge insertions and reversal, BST 2-child deletion with inorder successor, AVL LL rotation, min/max heaps, hash table collision chaining and tombstones).
- **`src/tests/graphs.test.js`**: 9 passing tests (BFS/DFS traversal completeness, Dijkstra negative edge rejection, Bellman-Ford negative cycle detection, Prim & Kruskal MST edge counts, Topological sort DAG verification and cycle rejection, Bipartite 2-coloring, A* search).
- **`src/tests/greedy_dp_backtracking.test.js`**: 11 passing tests (Fractional Knapsack optimal value, Activity Selection, 0/1 Knapsack DP table, LCS string reconstruction, Coin Change DP, Minimum Path Sum, N-Queens conflict-free placement, Maze escape path, 4x4 Sudoku constraint satisfaction).

**Total Test Result: 90 / 90 tests passing (100% success rate).**

---

## 7. Known Limitations & Future Scope
- **Current Limitations:**
  - Graph editor positions are optimized for standard 2D viewports; complex planar graphs with more than 20 nodes require manual vertex dragging for visual clarity.
  - Sudoku interactive visualizer defaults to 4x4 mini-sudoku to keep step-by-step backtracking readable without overwhelming browser animation queues.
- **Future Scope:**
  - Red-Black tree insertion and rebalancing visualizations.
  - Maximum Network Flow (Ford-Fulkerson / Edmonds-Karp) laboratory.
  - Interactive code sandbox allowing students to type JavaScript/Python implementations and compare against standard traces.
