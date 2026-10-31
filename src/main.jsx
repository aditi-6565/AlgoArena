import React, { useState, useMemo, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import {
  Binary, Activity, ArrowDownUp, Search, Layers3, Network, Zap,
  BrainCircuit, GitFork, Gauge, Trophy, ArrowLeftRight, Clock,
  Play, RotateCcw, ChevronDown, Sparkles
} from 'lucide-react';
import './style.css';

// Core & Data
import { ALGORITHMS_DATA, ALGORITHM_FAMILIES } from './data/algorithms.js';
import { SAMPLE_ARRAYS } from './data/defaultInputs.js';
import { getProgress, recordAlgorithmVisit, toggleBookmark } from './core/storage/progressStorage.js';

// Algorithms
import { generateSortingTrace } from './algorithms/sorting/sortingTraces.js';
import { generateSearchingTrace } from './algorithms/searching/searchingTraces.js';

// Components
import { Sidebar } from './components/common/Sidebar.jsx';
import { Topbar } from './components/common/Topbar.jsx';
import { GlobalSearchModal } from './components/common/GlobalSearchModal.jsx';
import { PlaybackControls } from './components/common/PlaybackControls.jsx';
import { PseudocodeViewer } from './components/common/PseudocodeViewer.jsx';
import { ComplexityCard } from './components/common/ComplexityCard.jsx';
import { ArrayVisualizer } from './components/visualizations/ArrayVisualizer.jsx';
import { ComplexityChart } from './components/visualizations/ComplexityChart.jsx';

// Modules
import { DashboardModule } from './components/modules/DashboardModule.jsx';
import { DataStructuresModule } from './components/modules/DataStructuresModule.jsx';
import { GraphModule } from './components/modules/GraphModule.jsx';
import { GreedyModule } from './components/modules/GreedyModule.jsx';
import { DynamicProgrammingModule } from './components/modules/DynamicProgrammingModule.jsx';
import { BacktrackingModule } from './components/modules/BacktrackingModule.jsx';
import { ComparisonModule } from './components/modules/ComparisonModule.jsx';
import { PracticeQuizModule } from './components/modules/PracticeQuizModule.jsx';
import { ProgressModule } from './components/modules/ProgressModule.jsx';

export function App() {
  const [activeModule, setActiveModule] = useState('Dashboard');
  const [activeAlgorithm, setActiveAlgorithm] = useState('Merge Sort');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [progress, setProgress] = useState(() => getProgress());

  // Input configuration for Sorting & Searching
  const [arrayInput, setArrayInput] = useState(() => SAMPLE_ARRAYS.random.join(', '));
  const [searchTarget, setSearchTarget] = useState('27');

  // Playback state
  const [stepsIndex, setStepsIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(500);

  const refreshProgress = () => {
    setProgress(getProgress());
  };

  const parsedArray = useMemo(() => {
    const nums = arrayInput
      .split(/[,\s]+/)
      .map(Number)
      .filter(Number.isFinite);
    return nums.length ? nums.slice(0, 20) : [10, 20, 30];
  }, [arrayInput]);

  // Generate trace based on active module
  const trace = useMemo(() => {
    if (activeModule === ALGORITHM_FAMILIES.SORTING) {
      return generateSortingTrace(parsedArray, activeAlgorithm);
    }
    if (activeModule === ALGORITHM_FAMILIES.SEARCHING) {
      return generateSearchingTrace(parsedArray, activeAlgorithm, Number(searchTarget));
    }
    return [];
  }, [activeModule, activeAlgorithm, parsedArray, searchTarget]);

  const currentStep = trace[Math.min(stepsIndex, Math.max(0, trace.length - 1))] || {
    array: parsedArray,
    line: 'Configure input and run the algorithm.',
    active: [],
    compared: [],
    swapped: [],
    sorted: []
  };

  // Playback timer
  useEffect(() => {
    if (!playing) return;
    const timer = setInterval(() => {
      setStepsIndex(idx => {
        if (idx >= trace.length - 1) {
          setPlaying(false);
          return idx;
        }
        return idx + 1;
      });
    }, speed);
    return () => clearInterval(timer);
  }, [playing, speed, trace.length]);

  // Reset steps on parameter change
  useEffect(() => {
    setStepsIndex(0);
    setPlaying(false);
  }, [activeModule, activeAlgorithm, arrayInput, searchTarget]);

  // Record visit
  const handleSelectAlgorithm = (algoName, family) => {
    const targetFamily = family || ALGORITHMS_DATA[algoName]?.family || ALGORITHM_FAMILIES.SORTING;
    setActiveModule(targetFamily);
    setActiveAlgorithm(algoName);
    recordAlgorithmVisit(algoName);
    refreshProgress();
    setIsSidebarOpen(false);
  };

  const handleBookmarkToggle = () => {
    toggleBookmark(activeAlgorithm);
    refreshProgress();
  };

  const isBookmarked = (progress.bookmarked || []).includes(activeAlgorithm);

  // Sorting and Searching options
  const sortingAlgos = [
    'Bubble Sort', 'Selection Sort', 'Insertion Sort', 'Merge Sort',
    'Quick Sort', 'Heap Sort', 'Shell Sort', 'Counting Sort', 'Radix Sort', 'Bucket Sort'
  ];
  const searchingAlgos = [
    'Linear Search', 'Binary Search', 'Jump Search', 'Interpolation Search', 'Exponential Search'
  ];

  const currentAlgorithmData = ALGORITHMS_DATA[activeAlgorithm] || ALGORITHMS_DATA['Merge Sort'];

  return (
    <div className="app-shell">
      <Sidebar
        activeModule={activeModule}
        onSelectModule={mod => {
          setActiveModule(mod);
          if (mod === ALGORITHM_FAMILIES.SORTING) setActiveAlgorithm('Merge Sort');
          if (mod === ALGORITHM_FAMILIES.SEARCHING) setActiveAlgorithm('Binary Search');
        }}
        activeAlgorithm={activeAlgorithm}
        onSelectAlgorithm={handleSelectAlgorithm}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <main className="main">
        <Topbar
          onOpenMenu={() => setIsSidebarOpen(true)}
          activeModule={activeModule}
          activeAlgorithm={['Sorting', 'Searching'].includes(activeModule) ? activeAlgorithm : null}
          onOpenSearch={() => setIsSearchOpen(true)}
          isBookmarked={isBookmarked}
          onToggleBookmark={handleBookmarkToggle}
        />

        <div className="content">
          {/* Global Search Dialog */}
          <GlobalSearchModal
            isOpen={isSearchOpen}
            onClose={() => setIsSearchOpen(false)}
            onSelect={(name, family) => {
              if (name === '__TOGGLE_SEARCH__') setIsSearchOpen(s => !s);
              else handleSelectAlgorithm(name, family);
            }}
          />

          {/* Module Dispatcher */}
          {activeModule === 'Dashboard' && (
            <DashboardModule
              onSelectModule={mod => {
                setActiveModule(mod);
                if (mod === ALGORITHM_FAMILIES.SORTING) setActiveAlgorithm('Merge Sort');
                if (mod === ALGORITHM_FAMILIES.SEARCHING) setActiveAlgorithm('Binary Search');
              }}
              onSelectAlgorithm={handleSelectAlgorithm}
              progress={progress}
              onLaunchChallenge={() => setActiveModule(ALGORITHM_FAMILIES.PRACTICE)}
            />
          )}

          {activeModule === ALGORITHM_FAMILIES.SORTING && (
            <div className="sorting-workbench-view">
              <div className="page-heading">
                <div>
                  <div className="eyebrow">
                    <span className="eyebrow-line" /> SORTING LABORATORY
                  </div>
                  <h1>
                    {activeAlgorithm} <span>Visualizer</span>
                  </h1>
                  <p>{currentAlgorithmData.description}</p>
                </div>
              </div>

              <div className="stats-row">
                <div className="stat-card">
                  <div className="stat-icon purple"><Zap size={16} /></div>
                  <div>
                    <small>ACTIVE SORT</small>
                    <strong>{activeAlgorithm}</strong>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon blue"><Gauge size={16} /></div>
                  <div>
                    <small>TIME (WORST)</small>
                    <strong>{currentAlgorithmData.timeWorst || 'O(n log n)'}</strong>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon green"><Layers3 size={16} /></div>
                  <div>
                    <small>SPACE COMPLEXITY</small>
                    <strong>{currentAlgorithmData.space || 'O(1)'}</strong>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon orange"><Activity size={16} /></div>
                  <div>
                    <small>COMPARISONS / SWAPS</small>
                    <strong>{currentStep.comparisons || 0} / {currentStep.swaps || 0}</strong>
                  </div>
                </div>
              </div>

              <div className="workspace-grid">
                {/* Input Panel */}
                <div className="panel input-panel">
                  <div className="panel-head">
                    <div>
                      <span className="section-kicker">01 / SETUP</span>
                      <h2>Input Configuration</h2>
                    </div>
                  </div>

                  <label className="field-label">SELECT ALGORITHM</label>
                  <div className="select-wrap">
                    <select
                      value={activeAlgorithm}
                      onChange={e => handleSelectAlgorithm(e.target.value, ALGORITHM_FAMILIES.SORTING)}
                    >
                      {sortingAlgos.map(a => <option key={a}>{a}</option>)}
                    </select>
                    <ChevronDown size={15} />
                  </div>

                  <label className="field-label input-label">ARRAY VALUES (COMMA SEPARATED)</label>
                  <textarea
                    rows="3"
                    value={arrayInput}
                    onChange={e => setArrayInput(e.target.value)}
                    placeholder="e.g. 38, 12, 27, 43, 9, 31"
                  />

                  <div className="preset-row">
                    <span>SAMPLES:</span>
                    <button onClick={() => setArrayInput(SAMPLE_ARRAYS.random.join(', '))}>Random</button>
                    <button onClick={() => setArrayInput(SAMPLE_ARRAYS.nearlySorted.join(', '))}>Nearly Sorted</button>
                    <button onClick={() => setArrayInput(SAMPLE_ARRAYS.reversed.join(', '))}>Reversed</button>
                    <button onClick={() => setArrayInput(SAMPLE_ARRAYS.duplicates.join(', '))}>Duplicates</button>
                    {activeAlgorithm === 'Counting Sort' && (
                      <button onClick={() => setArrayInput(SAMPLE_ARRAYS.countingSortSample.join(', '))}>Discrete [1..8]</button>
                    )}
                    {activeAlgorithm === 'Radix Sort' && (
                      <button onClick={() => setArrayInput(SAMPLE_ARRAYS.radixSortSample.join(', '))}>Multi-digit</button>
                    )}
                  </div>

                  <button
                    className="run-btn primary"
                    onClick={() => { setStepsIndex(0); setPlaying(true); }}
                  >
                    <Play size={15} fill="currentColor" /> Run {activeAlgorithm}
                  </button>
                </div>

                {/* Array Visualization */}
                <div className="panel viz-panel">
                  <div className="panel-head">
                    <div>
                      <span className="section-kicker">02 / VISUALIZE</span>
                      <h2>Array Visualization</h2>
                    </div>
                    <div className="canvas-badge"><span className="live-dot" /> LIVE CANVAS</div>
                  </div>

                  <div className="viz-legend">
                    <span><i className="legend-dot default-dot" /> Default</span>
                    <span><i className="legend-dot active-dot" /> Current Key</span>
                    <span><i className="legend-dot compare-dot" /> Compared</span>
                    <span><i className="legend-dot done-dot" /> Sorted</span>
                  </div>

                  <ArrayVisualizer step={currentStep} />

                  <div className="step-message">
                    <div className="step-number">{String(stepsIndex + 1).padStart(2, '0')}</div>
                    <div>
                      <small>CURRENT OPERATION</small>
                      <p>{currentStep.line}</p>
                    </div>
                    <span className="operation-tag">{currentStep.kind || 'ready'}</span>
                  </div>

                  <div style={{ marginTop: '12px' }}>
                    <PlaybackControls
                      playing={playing}
                      onTogglePlay={setPlaying}
                      currentIndex={stepsIndex}
                      totalSteps={trace.length}
                      onStepChange={setStepsIndex}
                      speed={speed}
                      onSpeedChange={setSpeed}
                    />
                  </div>
                </div>
              </div>

              <div className="bottom-grid">
                <div className="panel pseudocode-panel">
                  <div className="panel-head">
                    <div>
                      <span className="section-kicker">03 / UNDER THE HOOD</span>
                      <h2>Pseudocode</h2>
                    </div>
                    <span className="code-language">PSEUDOCODE</span>
                  </div>
                  <PseudocodeViewer
                    pseudocode={currentAlgorithmData.pseudocode}
                    activeLine={currentStep.codeLine || 0}
                  />
                </div>
                <ComplexityCard data={currentAlgorithmData} />
              </div>
            </div>
          )}

          {activeModule === ALGORITHM_FAMILIES.SEARCHING && (
            <div className="searching-workbench-view">
              <div className="page-heading">
                <div>
                  <div className="eyebrow">
                    <span className="eyebrow-line" /> SEARCHING LABORATORY
                  </div>
                  <h1>
                    {activeAlgorithm} <span>Visualizer</span>
                  </h1>
                  <p>{currentAlgorithmData.description}</p>
                </div>
              </div>

              <div className="workspace-grid">
                <div className="panel input-panel">
                  <div className="panel-head">
                    <div>
                      <span className="section-kicker">01 / SETUP</span>
                      <h2>Search Configuration</h2>
                    </div>
                  </div>

                  <label className="field-label">SELECT ALGORITHM</label>
                  <div className="select-wrap">
                    <select
                      value={activeAlgorithm}
                      onChange={e => handleSelectAlgorithm(e.target.value, ALGORITHM_FAMILIES.SEARCHING)}
                    >
                      {searchingAlgos.map(a => <option key={a}>{a}</option>)}
                    </select>
                    <ChevronDown size={15} />
                  </div>

                  <label className="field-label input-label">TARGET SEARCH KEY</label>
                  <input
                    type="number"
                    className="target-input"
                    value={searchTarget}
                    onChange={e => setSearchTarget(e.target.value)}
                  />

                  <label className="field-label input-label">ARRAY VALUES</label>
                  <textarea
                    rows="3"
                    value={arrayInput}
                    onChange={e => setArrayInput(e.target.value)}
                  />

                  <div className="preset-row">
                    <span>SORT PREREQUISITE:</span>
                    <button
                      onClick={() => {
                        const sorted = [...parsedArray].sort((a, b) => a - b);
                        setArrayInput(sorted.join(', '));
                      }}
                    >
                      Sort Array Monotonically
                    </button>
                  </div>

                  <button
                    className="run-btn primary"
                    onClick={() => { setStepsIndex(0); setPlaying(true); }}
                  >
                    <Play size={15} fill="currentColor" /> Search Target ({searchTarget})
                  </button>
                </div>

                <div className="panel viz-panel">
                  <div className="panel-head">
                    <div>
                      <span className="section-kicker">02 / VISUALIZE</span>
                      <h2>Search Range & Midpoint Probes</h2>
                    </div>
                    <div className="canvas-badge"><span className="live-dot" /> LIVE CANVAS</div>
                  </div>

                  <ArrayVisualizer step={currentStep} showPointers={true} />

                  <div className="step-message">
                    <div className="step-number">{String(stepsIndex + 1).padStart(2, '0')}</div>
                    <div>
                      <small>SEARCH STEP DETAILS</small>
                      <p>{currentStep.line}</p>
                    </div>
                    {currentStep.found && (
                      <span className="operation-tag" style={{ background: '#d7ede1', color: '#276840', fontWeight: 'bold' }}>
                        TARGET FOUND
                      </span>
                    )}
                  </div>

                  <div style={{ marginTop: '12px' }}>
                    <PlaybackControls
                      playing={playing}
                      onTogglePlay={setPlaying}
                      currentIndex={stepsIndex}
                      totalSteps={trace.length}
                      onStepChange={setStepsIndex}
                      speed={speed}
                      onSpeedChange={setSpeed}
                    />
                  </div>
                </div>
              </div>

              <div className="bottom-grid">
                <div className="panel pseudocode-panel">
                  <div className="panel-head">
                    <div>
                      <span className="section-kicker">03 / UNDER THE HOOD</span>
                      <h2>Pseudocode</h2>
                    </div>
                    <span className="code-language">PSEUDOCODE</span>
                  </div>
                  <PseudocodeViewer
                    pseudocode={currentAlgorithmData.pseudocode}
                    activeLine={currentStep.codeLine || 0}
                  />
                </div>
                <ComplexityCard data={currentAlgorithmData} />
              </div>
            </div>
          )}

          {activeModule === ALGORITHM_FAMILIES.DATA_STRUCTURES && (
            <DataStructuresModule />
          )}

          {activeModule === ALGORITHM_FAMILIES.GRAPHS && (
            <GraphModule />
          )}

          {activeModule === ALGORITHM_FAMILIES.GREEDY && (
            <GreedyModule />
          )}

          {activeModule === ALGORITHM_FAMILIES.DYNAMIC_PROGRAMMING && (
            <DynamicProgrammingModule />
          )}

          {activeModule === ALGORITHM_FAMILIES.BACKTRACKING && (
            <BacktrackingModule />
          )}

          {activeModule === ALGORITHM_FAMILIES.COMPARISON && (
            <ComparisonModule />
          )}

          {activeModule === ALGORITHM_FAMILIES.COMPLEXITY && (
            <ComplexityChart />
          )}

          {activeModule === ALGORITHM_FAMILIES.PRACTICE && (
            <PracticeQuizModule onProgressUpdated={refreshProgress} />
          )}

          {activeModule === ALGORITHM_FAMILIES.PROGRESS && (
            <ProgressModule
              progress={progress}
              onSelectAlgorithm={handleSelectAlgorithm}
              onRefresh={refreshProgress}
            />
          )}

          <footer>
            <div className="footer-brand">
              <div className="brand-mark small"><Binary size={15} /></div>
              <b>AlgoArena</b>
              <span>·</span>
              Interactive DSA Learning & Visualization Platform
            </div>
            <span>Academic Computer Science Workbench <Sparkles size={13} /></span>
          </footer>
        </div>
      </main>
    </div>
  );
}

const rootEl = document.getElementById('root');
if (rootEl) {
  createRoot(rootEl).render(<App />);
}
