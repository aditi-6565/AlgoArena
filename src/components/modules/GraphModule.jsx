import React, { useState, useMemo, useEffect } from 'react';
import { GraphEditorCanvas } from '../visualizations/GraphEditorCanvas.jsx';
import { PlaybackControls } from '../common/PlaybackControls.jsx';
import { PseudocodeViewer } from '../common/PseudocodeViewer.jsx';
import { ComplexityCard } from '../common/ComplexityCard.jsx';
import { generateGraphTrace } from '../../algorithms/graphs/graphTraces.js';
import { SAMPLE_GRAPHS } from '../../data/defaultInputs.js';
import { ALGORITHMS_DATA } from '../../data/algorithms.js';
import { Network, Play, RotateCcw, Share2, Layers } from 'lucide-react';

export function GraphModule() {
  const [selectedAlgo, setSelectedAlgo] = useState('BFS');
  const [graphData, setGraphData] = useState(() => JSON.parse(JSON.stringify(SAMPLE_GRAPHS.simple)));
  const [startVertex, setStartVertex] = useState('A');
  const [goalVertex, setGoalVertex] = useState('F');

  const [stepIdx, setStepIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(650);

  const graphAlgorithms = [
    'BFS', 'DFS', 'Dijkstra', 'Bellman-Ford', 'Floyd-Warshall',
    'Prim', 'Kruskal', 'Topological Sort', 'Cycle Detection',
    'Connected Components', 'Strongly Connected Components',
    'Bipartite Graph Check', 'Articulation Points', 'Bridges', 'A* Search'
  ];

  const trace = useMemo(() => {
    return generateGraphTrace(graphData, selectedAlgo, startVertex, goalVertex);
  }, [graphData, selectedAlgo, startVertex, goalVertex]);

  const currentStep = trace[Math.min(stepIdx, Math.max(0, trace.length - 1))] || {
    line: 'Graph ready for execution.',
    visited: [],
    frontier: [],
    activeEdges: []
  };

  // Playback timer
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

  // Reset step on parameter change
  useEffect(() => {
    setStepIdx(0);
    setPlaying(false);
  }, [selectedAlgo, graphData, startVertex, goalVertex]);

  // Handle load preset
  const loadPreset = (presetKey) => {
    if (SAMPLE_GRAPHS[presetKey]) {
      setGraphData(JSON.parse(JSON.stringify(SAMPLE_GRAPHS[presetKey])));
      const first = SAMPLE_GRAPHS[presetKey].vertices[0];
      const last = SAMPLE_GRAPHS[presetKey].vertices[SAMPLE_GRAPHS[presetKey].vertices.length - 1];
      setStartVertex(first);
      setGoalVertex(last);
      setStepIdx(0);
      setPlaying(false);
    }
  };

  const algoMeta = ALGORITHMS_DATA[selectedAlgo] || ALGORITHMS_DATA['BFS'];

  return (
    <div className="graph-module-view">
      <div className="workspace-grid">
        {/* Setup and Control Panel */}
        <div className="panel input-panel">
          <div className="panel-head">
            <div>
              <span className="section-kicker">01 / SETUP & SAMPLES</span>
              <h2>Graph Laboratory</h2>
            </div>
          </div>

          <label className="field-label">SELECT ALGORITHM (15 AVAILABLE)</label>
          <div className="select-wrap">
            <select
              value={selectedAlgo}
              onChange={e => setSelectedAlgo(e.target.value)}
            >
              {graphAlgorithms.map(a => <option key={a}>{a}</option>)}
            </select>
          </div>

          <div style={{ marginTop: '12px' }}>
            <label className="field-label">LOAD SAMPLE GRAPH</label>
            <div className="preset-row">
              <button onClick={() => loadPreset('simple')}>Simple Weighted</button>
              <button onClick={() => loadPreset('dag')}>DAG (Directed)</button>
              <button onClick={() => loadPreset('negativeWeights')}>Negative Weights</button>
              <button onClick={() => loadPreset('bipartiteSample')}>Bipartite Graph</button>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '14px' }}>
            <div>
              <label className="field-label">START VERTEX</label>
              <select
                className="target-input"
                value={startVertex}
                onChange={e => setStartVertex(e.target.value)}
              >
                {graphData.vertices.map(v => <option key={v}>{v}</option>)}
              </select>
            </div>
            {selectedAlgo === 'A* Search' && (
              <div>
                <label className="field-label">GOAL VERTEX</label>
                <select
                  className="target-input"
                  value={goalVertex}
                  onChange={e => setGoalVertex(e.target.value)}
                >
                  {graphData.vertices.map(v => <option key={v}>{v}</option>)}
                </select>
              </div>
            )}
          </div>

          <button
            className="run-btn primary"
            style={{ marginTop: '16px' }}
            onClick={() => { setStepIdx(0); setPlaying(true); }}
          >
            <Play size={15} fill="currentColor" /> Run {selectedAlgo}
          </button>
        </div>

        {/* Dynamic Graph Canvas */}
        <div className="panel viz-panel">
          <div className="panel-head">
            <div>
              <span className="section-kicker">02 / VISUALIZE</span>
              <h2>Interactive Graph Canvas</h2>
            </div>
            <div className="canvas-badge">
              <span className="live-dot" /> DYNAMIC SVG EDITOR
            </div>
          </div>

          <GraphEditorCanvas
            graph={graphData}
            onUpdateGraph={setGraphData}
            step={currentStep}
            startVertex={startVertex}
            onSelectStart={setStartVertex}
          />

          <div className="step-message">
            <div className="step-number">{String(stepIdx + 1).padStart(2, '0')}</div>
            <div>
              <small>CURRENT OPERATION</small>
              <p>{currentStep.line}</p>
            </div>
            <span className="operation-tag">{currentStep.kind || 'visit'}</span>
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

      {/* Analytics & Pseudocode */}
      <div className="bottom-grid">
        <div className="panel metrics-panel">
          <div className="panel-head">
            <div>
              <span className="section-kicker">03 / ANALYTICS</span>
              <h2>Graph Algorithm State</h2>
            </div>
          </div>

          {currentStep.distances && (
            <div style={{ marginBottom: '14px' }}>
              <span className="field-label">SHORTEST DISTANCES TABLE:</span>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '6px' }}>
                {Object.entries(currentStep.distances).map(([v, d]) => (
                  <span key={v} className="c-legend-item">
                    {v}: <b>{d === Infinity ? '∞' : d}</b>
                  </span>
                ))}
              </div>
            </div>
          )}

          {currentStep.frontier && currentStep.frontier.length > 0 && (
            <div style={{ marginBottom: '12px' }}>
              <span className="field-label">ACTIVE FRONTIER / QUEUE:</span>
              <div style={{ display: 'flex', gap: '6px', marginTop: '4px' }}>
                {currentStep.frontier.map((node, i) => (
                  <span key={i} className="chain-node">{node}</span>
                ))}
              </div>
            </div>
          )}

          <div className="metrics-grid">
            <div className="metric">
              <Network size={16} className="text-purple" />
              <div>
                <small>Visited Vertices</small>
                <strong>{currentStep.visited?.length || 0} / {graphData.vertices.length}</strong>
              </div>
            </div>
            <div className="metric">
              <Share2 size={16} className="text-green" />
              <div>
                <small>MST / Path Edges</small>
                <strong>{currentStep.mstEdges?.length || 0}</strong>
              </div>
            </div>
          </div>
        </div>

        <div className="panel pseudocode-panel">
          <div className="panel-head">
            <div>
              <span className="section-kicker">04 / UNDER THE HOOD</span>
              <h2>Pseudocode</h2>
            </div>
            <span className="code-language">PSEUDOCODE</span>
          </div>
          <PseudocodeViewer
            pseudocode={algoMeta.pseudocode}
            activeLine={currentStep.codeLine || 0}
          />
        </div>
      </div>

      <div style={{ marginTop: '16px' }}>
        <ComplexityCard data={algoMeta} />
      </div>
    </div>
  );
}
