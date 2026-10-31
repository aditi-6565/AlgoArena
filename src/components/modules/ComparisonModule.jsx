import React, { useState, useMemo, useEffect } from 'react';
import { generateSortingTrace } from '../../algorithms/sorting/sortingTraces.js';
import { generateSearchingTrace } from '../../algorithms/searching/searchingTraces.js';
import { generateGraphTrace } from '../../algorithms/graphs/graphTraces.js';
import { ArrayVisualizer } from '../visualizations/ArrayVisualizer.jsx';
import { GraphEditorCanvas } from '../visualizations/GraphEditorCanvas.jsx';
import { PlaybackControls } from '../common/PlaybackControls.jsx';
import { SAMPLE_ARRAYS, SAMPLE_GRAPHS } from '../../data/defaultInputs.js';
import { ALGORITHMS_DATA } from '../../data/algorithms.js';
import { ArrowLeftRight, Activity, Gauge, Timer, AlertCircle } from 'lucide-react';

export function ComparisonModule() {
  const [category, setCategory] = useState('Sorting');
  const [algoA, setAlgoA] = useState('Merge Sort');
  const [algoB, setAlgoB] = useState('Quick Sort');
  const [inputStr, setInputStr] = useState(SAMPLE_ARRAYS.random.join(', '));
  const [target, setTarget] = useState('27');

  const [stepIdx, setStepIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(500);

  // Time measurements (benchmarking in ms)
  const [benchA, setBenchA] = useState(0);
  const [benchB, setBenchB] = useState(0);

  const parsedArray = useMemo(() => {
    return inputStr.split(/[,\s]+/).map(Number).filter(Number.isFinite).slice(0, 16);
  }, [inputStr]);

  const traces = useMemo(() => {
    const t0 = performance.now();
    let traceA = [];
    let traceB = [];

    if (category === 'Sorting') {
      traceA = generateSortingTrace(parsedArray, algoA);
      const t1 = performance.now();
      traceB = generateSortingTrace(parsedArray, algoB);
      const t2 = performance.now();
      setBenchA(Number((t1 - t0).toFixed(3)));
      setBenchB(Number((t2 - t1).toFixed(3)));
    } else if (category === 'Searching') {
      const sorted = [...parsedArray].sort((a, b) => a - b);
      traceA = generateSearchingTrace(category === 'Searching' && algoA === 'Linear Search' ? parsedArray : sorted, algoA, Number(target));
      const t1 = performance.now();
      traceB = generateSearchingTrace(category === 'Searching' && algoB === 'Linear Search' ? parsedArray : sorted, algoB, Number(target));
      const t2 = performance.now();
      setBenchA(Number((t1 - t0).toFixed(3)));
      setBenchB(Number((t2 - t1).toFixed(3)));
    } else {
      traceA = generateGraphTrace(SAMPLE_GRAPHS.simple, algoA, 'A');
      const t1 = performance.now();
      traceB = generateGraphTrace(SAMPLE_GRAPHS.simple, algoB, 'A');
      const t2 = performance.now();
      setBenchA(Number((t1 - t0).toFixed(3)));
      setBenchB(Number((t2 - t1).toFixed(3)));
    }

    return { traceA, traceB };
  }, [category, algoA, algoB, parsedArray, target]);

  const maxSteps = Math.max(traces.traceA.length, traces.traceB.length);

  // Playback loop
  useEffect(() => {
    if (!playing) return;
    const interval = setInterval(() => {
      setStepIdx(curr => {
        if (curr >= maxSteps - 1) {
          setPlaying(false);
          return curr;
        }
        return curr + 1;
      });
    }, speed);
    return () => clearInterval(interval);
  }, [playing, speed, maxSteps]);

  // Reset on change
  useEffect(() => {
    setStepIdx(0);
    setPlaying(false);
  }, [category, algoA, algoB, inputStr, target]);

  const stepA = traces.traceA[Math.min(stepIdx, traces.traceA.length - 1)] || { array: parsedArray, line: 'Ready.' };
  const stepB = traces.traceB[Math.min(stepIdx, traces.traceB.length - 1)] || { array: parsedArray, line: 'Ready.' };

  const sortingOptions = ['Bubble Sort', 'Selection Sort', 'Insertion Sort', 'Merge Sort', 'Quick Sort', 'Heap Sort', 'Shell Sort'];
  const searchingOptions = ['Linear Search', 'Binary Search', 'Jump Search', 'Interpolation Search', 'Exponential Search'];
  const graphOptions = ['BFS', 'DFS'];

  const currentOptions = category === 'Sorting' ? sortingOptions : category === 'Searching' ? searchingOptions : graphOptions;

  return (
    <div className="comparison-studio-view">
      <div className="panel" style={{ padding: '16px', marginBottom: '14px' }}>
        <div className="panel-head">
          <div>
            <span className="section-kicker">COMPATIBLE ALGORITHM FACE-OFF</span>
            <h2>Side-by-Side Algorithm Comparison</h2>
          </div>
          <div className="preset-row">
            {['Sorting', 'Searching', 'Graph Traversal'].map(cat => (
              <button
                key={cat}
                className={category === cat ? 'active-preset' : ''}
                onClick={() => {
                  setCategory(cat);
                  if (cat === 'Sorting') { setAlgoA('Merge Sort'); setAlgoB('Quick Sort'); }
                  else if (cat === 'Searching') { setAlgoA('Linear Search'); setAlgoB('Binary Search'); }
                  else { setAlgoA('BFS'); setAlgoB('DFS'); }
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="comparison-config-grid">
          <div>
            <label className="field-label">ALGORITHM A</label>
            <select
              className="target-input"
              value={algoA}
              onChange={e => setAlgoA(e.target.value)}
            >
              {currentOptions.filter(o => o !== algoB).map(o => <option key={o}>{o}</option>)}
            </select>
          </div>
          <div>
            <label className="field-label">ALGORITHM B</label>
            <select
              className="target-input"
              value={algoB}
              onChange={e => setAlgoB(e.target.value)}
            >
              {currentOptions.filter(o => o !== algoA).map(o => <option key={o}>{o}</option>)}
            </select>
          </div>
          {category !== 'Graph Traversal' && (
            <div style={{ gridColumn: 'span 2' }}>
              <label className="field-label">SHARED INPUT ARRAY</label>
              <input
                className="target-input"
                value={inputStr}
                onChange={e => setInputStr(e.target.value)}
              />
            </div>
          )}
          {category === 'Searching' && (
            <div>
              <label className="field-label">TARGET KEY</label>
              <input
                className="target-input"
                value={target}
                onChange={e => setTarget(e.target.value)}
              />
            </div>
          )}
        </div>

        <div style={{ marginTop: '14px' }}>
          <PlaybackControls
            playing={playing}
            onTogglePlay={setPlaying}
            currentIndex={stepIdx}
            totalSteps={maxSteps}
            onStepChange={setStepIdx}
            speed={speed}
            onSpeedChange={setSpeed}
          />
        </div>
      </div>

      {/* Side-by-Side Cards */}
      <div className="compare-grid">
        {/* Card A */}
        <div className="compare-card">
          <div className="compare-card-head">
            <span className="compare-letter">A</span>
            <div>
              <strong>{algoA}</strong>
              <small>Time: {ALGORITHMS_DATA[algoA]?.timeAvg || ALGORITHMS_DATA[algoA]?.time || 'O(n)'} · Space: {ALGORITHMS_DATA[algoA]?.space || 'O(1)'}</small>
            </div>
            <span className="mini-step">STEP {Math.min(stepIdx + 1, traces.traceA.length)} / {traces.traceA.length}</span>
          </div>

          {category !== 'Graph Traversal' ? (
            <ArrayVisualizer step={stepA} compact={true} />
          ) : (
            <GraphEditorCanvas graph={SAMPLE_GRAPHS.simple} step={stepA} readOnly={true} />
          )}

          <div className="compare-caption">{stepA.line}</div>

          <div className="metrics-grid" style={{ marginTop: '10px' }}>
            <div className="metric">
              <Activity size={14} className="text-purple" />
              <div>
                <small>Comparisons</small>
                <strong>{stepA.comparisons || 0}</strong>
              </div>
            </div>
            <div className="metric">
              <Gauge size={14} className="text-orange" />
              <div>
                <small>Swaps / Writes</small>
                <strong>{stepA.swaps || 0}</strong>
              </div>
            </div>
            <div className="metric">
              <Timer size={14} className="text-blue" />
              <div>
                <small>Trace Time</small>
                <strong>{benchA} ms</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Card B */}
        <div className="compare-card">
          <div className="compare-card-head">
            <span className="compare-letter letter-b">B</span>
            <div>
              <strong>{algoB}</strong>
              <small>Time: {ALGORITHMS_DATA[algoB]?.timeAvg || ALGORITHMS_DATA[algoB]?.time || 'O(n)'} · Space: {ALGORITHMS_DATA[algoB]?.space || 'O(1)'}</small>
            </div>
            <span className="mini-step">STEP {Math.min(stepIdx + 1, traces.traceB.length)} / {traces.traceB.length}</span>
          </div>

          {category !== 'Graph Traversal' ? (
            <ArrayVisualizer step={stepB} compact={true} />
          ) : (
            <GraphEditorCanvas graph={SAMPLE_GRAPHS.simple} step={stepB} readOnly={true} />
          )}

          <div className="compare-caption">{stepB.line}</div>

          <div className="metrics-grid" style={{ marginTop: '10px' }}>
            <div className="metric">
              <Activity size={14} className="text-purple" />
              <div>
                <small>Comparisons</small>
                <strong>{stepB.comparisons || 0}</strong>
              </div>
            </div>
            <div className="metric">
              <Gauge size={14} className="text-orange" />
              <div>
                <small>Swaps / Writes</small>
                <strong>{stepB.swaps || 0}</strong>
              </div>
            </div>
            <div className="metric">
              <Timer size={14} className="text-blue" />
              <div>
                <small>Trace Time</small>
                <strong>{benchB} ms</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="asymptotic-note-box" style={{ marginTop: '14px' }}>
        <AlertCircle size={15} />
        <div>
          <strong>Computer Science Evaluation Note:</strong>
          <p>
            Both algorithms execute over the exact same input instance simultaneously. Notice how operation counts (comparisons, memory swaps) directly manifest theoretical complexity: for small arrays, Insertion Sort or Bubble Sort can require fewer operations than Merge Sort due to divide-and-conquer recursion constants, but scale unfavorably as n expands.
          </p>
        </div>
      </div>
    </div>
  );
}
