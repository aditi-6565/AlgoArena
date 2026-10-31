import React, { useState, useMemo, useEffect } from 'react';
import { generateGreedyTrace } from '../../algorithms/greedy/greedyTraces.js';
import { PlaybackControls } from '../common/PlaybackControls.jsx';
import { PseudocodeViewer } from '../common/PseudocodeViewer.jsx';
import { ComplexityCard } from '../common/ComplexityCard.jsx';
import { ALGORITHMS_DATA } from '../../data/algorithms.js';
import { Zap, Play, CheckCircle, XCircle } from 'lucide-react';

export function GreedyModule() {
  const [selectedAlgo, setSelectedAlgo] = useState('Activity Selection');
  const [stepIdx, setStepIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(650);

  const algorithms = [
    'Activity Selection',
    'Fractional Knapsack',
    'Job Sequencing with Deadlines',
    'Coin Change Greedy',
    'Minimum Platforms'
  ];

  const trace = useMemo(() => {
    return generateGreedyTrace(selectedAlgo);
  }, [selectedAlgo]);

  const currentStep = trace[Math.min(stepIdx, Math.max(0, trace.length - 1))] || {
    line: 'Ready.',
    items: [],
    selected: [],
    rejected: []
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

  const meta = ALGORITHMS_DATA[selectedAlgo] || ALGORITHMS_DATA['Activity Selection'];

  return (
    <div className="greedy-module-view">
      <div className="workspace-grid">
        <div className="panel input-panel">
          <div className="panel-head">
            <div>
              <span className="section-kicker">01 / SETUP</span>
              <h2>Greedy Algorithms</h2>
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
              <h2>Step-by-Step Greedy Decisions</h2>
            </div>
            <div className="canvas-badge"><span className="live-dot" /> DECISION LOG</div>
          </div>

          {/* Interactive Decisions Table / Item Cards */}
          <div className="structure-canvas" style={{ padding: '16px', height: 'auto', minHeight: '220px' }}>
            <div className="greedy-items-deck" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {(currentStep.items || []).map((it, idx) => {
                const isSelected = (currentStep.selected || []).includes(it.id);
                const isRejected = (currentStep.rejected || []).includes(it.id);
                const isCurrent = currentStep.current === it.id;

                let cardClass = 'greedy-item-card';
                if (isSelected) cardClass += ' selected';
                if (isRejected) cardClass += ' rejected';
                if (isCurrent) cardClass += ' current-inspect';

                return (
                  <div key={idx} className={cardClass} style={{
                    border: '1.5px solid #dedbd0',
                    borderRadius: '8px',
                    padding: '8px 12px',
                    background: isSelected ? '#e4eee6' : isRejected ? '#faebe9' : isCurrent ? '#faebd7' : '#fffefa',
                    minWidth: '90px'
                  }}>
                    <strong style={{ display: 'block', fontSize: '11px' }}>{it.id}</strong>
                    {it.start !== undefined && <small style={{ display: 'block', fontSize: '9px', color: '#687064' }}>{it.start} → {it.finish}</small>}
                    {it.ratio !== undefined && <small style={{ display: 'block', fontSize: '9px', color: '#687064' }}>ratio: {it.ratio}</small>}
                    {it.profit !== undefined && <small style={{ display: 'block', fontSize: '9px', color: '#687064' }}>p: ${it.profit}, d: {it.deadline}</small>}
                    <div style={{ marginTop: '4px' }}>
                      {isSelected && <span style={{ color: '#387c4d', fontSize: '10px', fontWeight: 'bold' }}>✓ Selected</span>}
                      {isRejected && <span style={{ color: '#b54444', fontSize: '10px', fontWeight: 'bold' }}>✗ Rejected</span>}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="structure-stats" style={{ marginTop: '16px', width: '100%' }}>
              <span>{currentStep.metricName}: <b>{currentStep.metricValue}</b></span>
              <span>Selected Total: {(currentStep.selected || []).length}</span>
            </div>
          </div>

          <div className="step-message">
            <div className="step-number">{String(stepIdx + 1).padStart(2, '0')}</div>
            <div>
              <small>GREEDY CHOICE EXPLANATION</small>
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
