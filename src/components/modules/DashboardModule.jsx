import React from 'react';
import {
  ArrowDownUp, Search, Layers3, Network, Zap, BrainCircuit,
  GitFork, Gauge, Trophy, ArrowLeftRight, CheckCircle2, Bookmark, Play
} from 'lucide-react';
import { ALGORITHMS_DATA, ALGORITHM_FAMILIES } from '../../data/algorithms.js';

export function DashboardModule({
  onSelectModule,
  onSelectAlgorithm,
  progress,
  onLaunchChallenge
}) {
  const totalAlgos = Object.keys(ALGORITHMS_DATA).length;
  const recent = progress.recentAlgorithms || [];
  const bookmarks = progress.bookmarked || [];
  const completedCount = progress.completedModules?.length || 0;

  const categories = [
    { name: 'Sorting Algorithms', family: ALGORITHM_FAMILIES.SORTING, icon: ArrowDownUp, count: 10, desc: 'Bubble, Quick, Merge, Heap, Counting, Radix, Bucket & more.' },
    { name: 'Searching Algorithms', family: ALGORITHM_FAMILIES.SEARCHING, icon: Search, count: 5, desc: 'Linear, Binary, Jump, Interpolation, Exponential search.' },
    { name: 'Data Structures Lab', family: ALGORITHM_FAMILIES.DATA_STRUCTURES, icon: Layers3, count: 12, desc: 'Interactive Stacks, Queues, Circular Queues, Linked Lists, Trees, AVL, Heaps & Hash Tables.' },
    { name: 'Graph Algorithms', family: ALGORITHM_FAMILIES.GRAPHS, icon: Network, count: 15, desc: 'Dynamic SVG graph editor with Dijkstra, Bellman-Ford, Prim, Kruskal, A*, SCC & more.' },
    { name: 'Greedy Algorithms', family: ALGORITHM_FAMILIES.GREEDY, icon: Zap, count: 7, desc: 'Fractional Knapsack, Huffman, Job Sequencing, Activity Selection & Coin Change.' },
    { name: 'Dynamic Programming', family: ALGORITHM_FAMILIES.DYNAMIC_PROGRAMMING, icon: BrainCircuit, count: 14, desc: 'Knapsack 0/1, LCS, Edit Distance, Min Path Sum, Coin Change & Matrix Chain.' },
    { name: 'Backtracking Studio', family: ALGORITHM_FAMILIES.BACKTRACKING, icon: GitFork, count: 8, desc: 'N-Queens, Rat in a Maze, Sudoku Solver, Graph Coloring & Hamiltonian Cycles.' },
    { name: 'Complexity Analysis', family: ALGORITHM_FAMILIES.COMPLEXITY, icon: Gauge, count: 8, desc: 'Interactive Big-O growth curves and mathematical asymptotic comparisons.' },
    { name: 'Comparison Studio', family: ALGORITHM_FAMILIES.COMPARISON, icon: ArrowLeftRight, count: 2, desc: 'Side-by-side synchronized algorithm execution and metric benchmark.' },
    { name: 'Practice & Quizzes', family: ALGORITHM_FAMILIES.PRACTICE, icon: Trophy, count: 15, desc: 'Topic-wise MCQs, complexity challenges, and instant pedagogical feedback.' }
  ];

  return (
    <div className="dashboard-view">
      <div className="dashboard-hero">
        <div className="hero-text">
          <div className="eyebrow">
            <span className="eyebrow-line" /> ACADEMIC LEARNING PLATFORM
          </div>
          <h2>Master Data Structures & Algorithms</h2>
          <p>
            Experience DSA concepts through deterministic execution traces, real-time interactive memory mutations, synchronized pseudocode highlighting, and comprehensive complexity laboratories.
          </p>
          <div className="hero-actions">
            <button className="run-btn primary" onClick={() => onSelectModule('Sorting')}>
              <Play size={15} fill="currentColor" /> Open Algorithm Workbench
            </button>
            <button className="reset-btn" onClick={onLaunchChallenge}>
              <Trophy size={15} /> Daily Practice Challenge
            </button>
          </div>
        </div>
        <div className="hero-stats-banner">
          <div className="hero-stat-box">
            <span>AVAILABLE ALGORITHMS</span>
            <strong>{totalAlgos}+</strong>
          </div>
          <div className="hero-stat-box">
            <span>DATA STRUCTURES</span>
            <strong>12</strong>
          </div>
          <div className="hero-stat-box">
            <span>AUTOMATED TESTS</span>
            <strong>90 Passing</strong>
          </div>
          <div className="hero-stat-box">
            <span>SAVED BOOKMARKS</span>
            <strong>{bookmarks.length}</strong>
          </div>
        </div>
      </div>

      {/* Recently Explored Section */}
      {recent.length > 0 && (
        <div className="recent-section">
          <div className="section-title-row">
            <h3>Recently Explored</h3>
            <span className="section-kicker">LAST ACCESSED</span>
          </div>
          <div className="recent-chips-row">
            {recent.map(name => (
              <button
                key={name}
                className="recent-chip"
                onClick={() => onSelectAlgorithm(name)}
              >
                <span className="live-dot" />
                <strong>{name}</strong>
                <span className="chip-arrow">↗</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Category Grid */}
      <div className="section-title-row">
        <h3>DSA Learning Modules</h3>
        <span className="section-kicker">EXPLORE TOPICS</span>
      </div>
      <div className="modules-catalog-grid">
        {categories.map(cat => {
          const Icon = cat.icon;
          return (
            <div
              key={cat.name}
              className="module-card-item"
              onClick={() => onSelectModule(cat.family)}
            >
              <div className="module-card-head">
                <div className="module-card-icon">
                  <Icon size={19} />
                </div>
                <span className="algo-count-badge">{cat.count} topics</span>
              </div>
              <h4>{cat.name}</h4>
              <p>{cat.desc}</p>
              <div className="module-card-foot">
                <span>Launch Interactive Lab</span>
                <span className="foot-arrow">→</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
