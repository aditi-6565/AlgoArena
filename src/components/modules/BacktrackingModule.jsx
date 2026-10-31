import React, { useState, useMemo, useEffect } from 'react';
import { generateBacktrackingTrace } from '../../algorithms/backtracking/backtrackingTraces.js';
import { GridVisualizer } from '../visualizations/GridVisualizer.jsx';
import { PlaybackControls } from '../common/PlaybackControls.jsx';
import { PseudocodeViewer } from '../common/PseudocodeViewer.jsx';
import { ComplexityCard } from '../common/ComplexityCard.jsx';
import { ALGORITHMS_DATA } from '../../data/algorithms.js';
import { GitFork, Play } from 'lucide-react';

export function BacktrackingModule() {
  const [selectedAlgo, setSelectedAlgo] = useState('N-Queens');
  const [nQueensSize, setNQueensSize] = useState(4);
  const [stepIdx, setStepIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(650);

  const algorithms = ['N-Queens', 'Rat in a Maze', 'Sudoku Solver'];

  const trace = useMemo(() => {
    return generateBacktrackingTrace(selectedAlgo, { n: Number(nQueensSize) });
  }, [selectedAlgo, nQueensSize]);

  const currentStep = trace[Math.min(stepIdx, Math.max(0, trace.length - 1))] || {
    line: 'Backtracking initialized.',
    board: []
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
  }, [selectedAlgo, nQueensSize]);

  const meta = ALGORITHMS_DATA[selectedAlgo] || ALGORITHMS_DATA['N-Queens'];
  const gridKind = selectedAlgo === 'N-Queens' ? 'queens' : selectedAlgo === 'Rat in a Maze' ? 'maze' : 'sudoku';

  return (
    <div className="backtracking-module-view">
      <div className="workspace-grid">
        <div className="panel input-panel">
          <div className="panel-head">
            <div>
              <span className="section-kicker">01 / SETUP</span>
              <h2>Backtracking Studio</h2>
            </div>
          </div>

          <label className="field-label">SELECT ALGORITHM</label>
          <div className="select-wrap">
            <select
              value={selectedAlgo}
              onChange={e => setSelectedAlgo(e.target.value)}
            >
              {algorithms.map(a => <option key={a}>{a}</option>)}
            </select>
          </div>

          {selectedAlgo === 'N-Queens' && (
            <div style={{ marginTop: '14px' }}>
              <label className="field-label">BOARD SIZE (N×N)</label>
              <div className="preset-row">
                {[4, 5, 6].map(sz => (
                  <button
                    key={sz}
                    className={nQueensSize === sz ? 'active-preset' : ''}
                    onClick={() => setNQueensSize(sz)}
                  >
                    {sz}×{sz}
                  </button>
                ))}
              </div>
            </div>
          )}

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
              <h2>Search Space & Board Decisions</h2>
            </div>
            <div className="canvas-badge"><span className="live-dot" /> LIVE STATE</div>
          </div>

          <GridVisualizer
            kind={gridKind}
            board={currentStep.board}
            activeCells={currentStep.activeCells}
            conflictCells={currentStep.conflictCells}
          />

          <div className="step-message">
            <div className="step-number">{String(stepIdx + 1).padStart(2, '0')}</div>
            <div>
              <small>DECISION TRACE</small>
              <p>{currentStep.line}</p>
            </div>
            <span className="operation-tag">{currentStep.kind || 'explore'}</span>
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
