import React, { useState } from 'react';
import { Layers, Activity, Info } from 'lucide-react';

export function ComplexityChart() {
  const [n, setN] = useState(25);

  const complexities = [
    { label: 'O(1)', color: '#4d9a70', name: 'Constant', compute: () => 1, desc: 'Hash lookups, array index access' },
    { label: 'O(log n)', color: '#4f7d7b', name: 'Logarithmic', compute: (x) => Math.log2(x), desc: 'Binary search, balanced tree queries' },
    { label: 'O(n)', color: '#5b6f54', name: 'Linear', compute: (x) => x, desc: 'Linear scan, counting sort' },
    { label: 'O(n log n)', color: '#3a6b88', name: 'Linearithmic', compute: (x) => x * Math.log2(x), desc: 'Merge Sort, Quick Sort, Heap Sort' },
    { label: 'O(n²)', color: '#c48045', name: 'Quadratic', compute: (x) => x * x, desc: 'Bubble Sort, Insertion Sort, nested loops' },
    { label: 'O(2ⁿ)', color: '#b24c4c', name: 'Exponential', compute: (x) => Math.pow(2, Math.min(x, 20)), desc: 'Recursive Fibonacci, power set' }
  ];

  // SVG Chart Dimensions
  const width = 560;
  const height = 260;
  const padLeft = 45;
  const padBottom = 30;
  const chartW = width - padLeft - 20;
  const chartH = height - padBottom - 20;

  const maxN = 50;
  const maxY = 2500; // quadratic at n=50 is 2500

  const getPoints = (computeFn) => {
    const pts = [];
    for (let x = 1; x <= n; x++) {
      const yVal = Math.min(maxY, computeFn(x));
      const px = padLeft + (x / maxN) * chartW;
      const py = height - padBottom - (yVal / maxY) * chartH;
      pts.push(`${px.toFixed(1)},${py.toFixed(1)}`);
    }
    return pts.join(' ');
  };

  return (
    <div className="complexity-lab-container">
      <div className="complexity-controls-bar">
        <div className="slider-box">
          <label className="field-label">
            INPUT SIZE (n): <b>{n} elements</b>
          </label>
          <input
            type="range"
            min="2"
            max={maxN}
            value={n}
            onChange={e => setN(Number(e.target.value))}
            className="n-slider"
          />
        </div>
        <div className="complexity-badge-row">
          {complexities.map(c => (
            <span key={c.label} className="c-legend-item" style={{ borderColor: c.color }}>
              <span className="c-color-dot" style={{ background: c.color }} />
              <b>{c.label}</b>
              <small>({c.compute(n).toFixed(0)} ops)</small>
            </span>
          ))}
        </div>
      </div>

      <div className="complexity-chart-canvas">
        <svg viewBox={`0 0 ${width} ${height}`} className="complexity-svg">
          {/* Grid lines */}
          <line x1={padLeft} y1={20} x2={padLeft} y2={height - padBottom} stroke="#dedbd1" strokeWidth="1.5" />
          <line x1={padLeft} y1={height - padBottom} x2={width - 20} y2={height - padBottom} stroke="#dedbd1" strokeWidth="1.5" />

          {/* Axes labels */}
          <text x={padLeft - 10} y={30} textAnchor="end" className="chart-axis-text">Operations (f(n))</text>
          <text x={width - 25} y={height - 10} textAnchor="end" className="chart-axis-text">Input Size (n)</text>

          {/* Curves */}
          {complexities.map(c => (
            <polyline
              key={c.label}
              fill="none"
              stroke={c.color}
              strokeWidth="2.5"
              points={getPoints(c.compute)}
            />
          ))}
        </svg>
      </div>

      <div className="complexity-cards-grid">
        {complexities.map(c => (
          <div key={c.label} className="c-info-card">
            <div className="c-card-top">
              <span className="c-badge" style={{ background: c.color }}>{c.label}</span>
              <strong>{c.name} Time</strong>
            </div>
            <p className="c-desc">{c.desc}</p>
            <div className="c-op-val">
              At n = {n}: <b>{Math.round(c.compute(n)).toLocaleString()}</b> operations
            </div>
          </div>
        ))}
      </div>

      <div className="asymptotic-note-box">
        <Info size={16} />
        <div>
          <strong>Theoretical Asymptotic Complexity vs. Wall-Clock Browser Runtime:</strong>
          <p>
            Big-O measures the growth rate of required fundamental operations (comparisons, memory swaps) as n approaches infinity. Wall-clock execution time in milliseconds varies by hardware, CPU load, V8 engine JIT optimization, and garbage collection, but asymptotic order (e.g., O(n log n) defeating O(n²)) remains invariant across all computer architectures.
          </p>
        </div>
      </div>
    </div>
  );
}
