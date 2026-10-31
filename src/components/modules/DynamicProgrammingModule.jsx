import React, { useState, useMemo, useEffect } from 'react';
import { generateDPTrace } from '../../algorithms/dynamic-programming/dpTraces.js';
import { TableVisualizer } from '../visualizations/TableVisualizer.jsx';
import { PlaybackControls } from '../common/PlaybackControls.jsx';
import { PseudocodeViewer } from '../common/PseudocodeViewer.jsx';
import { ComplexityCard } from '../common/ComplexityCard.jsx';
import { ALGORITHMS_DATA } from '../../data/algorithms.js';
import { BrainCircuit, Play } from 'lucide-react';

export function DynamicProgrammingModule() {
  const [selectedAlgo, setSelectedAlgo] = useState('0/1 Knapsack');
  const [stepIdx, setStepIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(650);

  const dpAlgorithms = [
    '0/1 Knapsack',
    'Longest Common Subsequence',
    'Coin Change DP',
    'Edit Distance',
    'Minimum Path Sum'
  ];

  const trace = useMemo(() => {
    return generateDPTrace(selectedAlgo);
  }, [selectedAlgo]);

  const currentStep = trace[Math.min(stepIdx, Math.max(0, trace.length - 1))] || {
    line: 'DP Matrix initialized.',
    table: [],
    rowHeaders: [],
    colHeaders: []
  };

  useEffect(() => {
    if (!playing) return;
    const timer = setInterval(() => {
      setStepIdx(i => {
        if (i >= trace.length - 1) {
          setPlaying(false);
          return i;
        }
        return i + 1;
      });
    }, speed);
    return () => clearInterval(timer);
  }, [playing, speed, trace.length]);

  useEffect(() => {
    setStepIdx(0);
    setPlaying(false);
  }, [selectedAlgo]);

  const meta = ALGORITHMS_DATA[selectedAlgo] || ALGORITHMS_DATA['0/1 Knapsack'];

  return (
    <div className="dp-module-view">
      <div className="workspace-grid">
        <div className="panel input-panel">
          <div className="panel-head">
            <div>
              <span className="section-kicker">01 / SETUP</span>
              <h2>Dynamic Programming Studio</h2>
            </div>
          </div>

          <label className="field-label">SELECT DP ALGORITHM</label>
          <div className="select-wrap">
            <select
              value={selectedAlgo}
              onChange={e => setSelectedAlgo(e.target.value)}
            >
              {dpAlgorithms.map(a => <option key={a}>{a}</option>)}
            </select>
          </div>

          <div style={{ marginTop: '16px' }}>
            <button
              className="run-btn primary"
              onClick={() => { setStepIdx(0); setPlaying(true); }}
            >
              <Play size={15} fill="currentColor" /> Run {selectedAlgo}
            </button>
          </div>
        </div>

        <div className="panel viz-panel">
          <div className="panel-head">
            <div>
              <span className="section-kicker">02 / VISUALIZE</span>
              <h2>DP Memoization & Tabulation Matrix</h2>
            </div>
            <div className="canvas-badge"><span className="live-dot" /> 2D TABLE</div>
          </div>

          <TableVisualizer
            table={currentStep.table}
            rowHeaders={currentStep.rowHeaders}
            colHeaders={currentStep.colHeaders}
            activeCell={currentStep.activeCell}
            referencedCells={currentStep.referencedCells}
            backtrackPath={currentStep.backtrackPath}
            recurrence={currentStep.recurrence}
          />

          <div className="step-message">
            <div className="step-number">{String(stepIdx + 1).padStart(2, '0')}</div>
            <div>
              <small>CELL COMPUTATION LOG</small>
              <p>{currentStep.line}</p>
            </div>
          </div>

          <div style={{ marginTop: '12px' }}>
            <PlaybackControls
              playing={playing}
              onTogglePlay={setPlaying}
              currentIndex={stepIdx}
              totalSteps={trace.length}
              onStepChange={setStepIdx}
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
          <PseudocodeViewer pseudocode={meta.pseudocode} activeLine={currentStep.codeLine || 0} />
        </div>
        <ComplexityCard data={meta} />
      </div>
    </div>
  );
}
