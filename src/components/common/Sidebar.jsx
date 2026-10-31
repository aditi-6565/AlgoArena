import React from 'react';
import {
  Binary, Activity, ArrowDownUp, Search, Layers3, Network, Zap,
  BrainCircuit, GitFork, Gauge, Trophy, ArrowLeftRight, Clock, Sparkles, X
} from 'lucide-react';
import { ALGORITHM_FAMILIES } from '../../data/algorithms.js';

export function Sidebar({
  activeModule,
  onSelectModule,
  activeAlgorithm,
  onSelectAlgorithm,
  isOpen,
  onClose
}) {
  const navItems = [
    { id: 'Dashboard', label: 'Dashboard', icon: Activity, count: null },
    { id: ALGORITHM_FAMILIES.SORTING, label: 'Sorting Lab', icon: ArrowDownUp, count: 10 },
    { id: ALGORITHM_FAMILIES.SEARCHING, label: 'Searching Lab', icon: Search, count: 5 },
    { id: ALGORITHM_FAMILIES.DATA_STRUCTURES, label: 'Data Structures', icon: Layers3, count: 12 },
    { id: ALGORITHM_FAMILIES.GRAPHS, label: 'Graph Algorithms', icon: Network, count: 15 },
    { id: ALGORITHM_FAMILIES.GREEDY, label: 'Greedy Algorithms', icon: Zap, count: 7 },
    { id: ALGORITHM_FAMILIES.DYNAMIC_PROGRAMMING, label: 'Dynamic Programming', icon: BrainCircuit, count: 14 },
    { id: ALGORITHM_FAMILIES.BACKTRACKING, label: 'Backtracking Studio', icon: GitFork, count: 8 },
    { id: ALGORITHM_FAMILIES.COMPARISON, label: 'Comparison Studio', icon: ArrowLeftRight, count: null },
    { id: ALGORITHM_FAMILIES.COMPLEXITY, label: 'Complexity Analysis', icon: Gauge, count: null },
    { id: ALGORITHM_FAMILIES.PRACTICE, label: 'Practice & Quizzes', icon: Trophy, count: null },
    { id: ALGORITHM_FAMILIES.PROGRESS, label: 'Learning Progress', icon: Clock, count: null }
  ];

  return (
    <>
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="brand">
          <div className="brand-mark">
            <Binary size={24} />
          </div>
          <div>
            <div className="brand-name">
              Algo<span>Arena</span>
            </div>
            <div className="brand-sub">DSA BATTLE LAB</div>
          </div>
          <button className="icon-btn mobile-close" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="side-label">LEARNING WORKBENCH</div>
        <div className="sidebar-nav-scroll">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeModule === item.id;
            return (
              <button
                key={item.id}
                className={`nav-item ${isActive ? 'active' : ''}`}
                onClick={() => {
                  onSelectModule(item.id);
                  if (onClose) onClose();
                }}
              >
                <Icon size={16} />
                <span>{item.label}</span>
                {item.count && <span className="nav-count-pill">{item.count}</span>}
                {isActive && <span className="live-dot" />}
              </button>
            );
          })}
        </div>

        <div className="sidebar-bottom">
          <div className="avatar">AA</div>
          <div>
            <strong>Interactive DSA</strong>
            <small>Deterministic Step Engine</small>
          </div>
          <Sparkles size={16} className="sparkle" />
        </div>
      </aside>

      {isOpen && <div className="scrim" onClick={onClose} />}
    </>
  );
}
