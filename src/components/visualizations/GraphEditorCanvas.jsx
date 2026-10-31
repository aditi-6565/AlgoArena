import React, { useState, useRef } from 'react';
import { Plus, Trash2, ArrowRight, CornerDownRight, RefreshCw } from 'lucide-react';

export function GraphEditorCanvas({
  graph,
  onUpdateGraph,
  step = {},
  readOnly = false,
  startVertex,
  onSelectStart
}) {
  const [selectedVertex, setSelectedVertex] = useState(null);
  const [draggingVertex, setDraggingVertex] = useState(null);
  const [edgeWeightInput, setEdgeWeightInput] = useState(1);
  const svgRef = useRef(null);

  const { vertices = [], edges = [], positions = {}, directed = false } = graph;

  const visited = step.visited || [];
  const currentVertex = step.vertex;
  const activeEdges = step.activeEdges || [];
  const mstEdges = step.mstEdges || [];

  // Dragging vertex handlers
  const handleMouseDown = (v, e) => {
    e.stopPropagation();
    if (readOnly) return;
    setDraggingVertex(v);
  };

  const handleMouseMove = (e) => {
    if (!draggingVertex || !svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const x = Math.max(30, Math.min(rect.width - 30, e.clientX - rect.left));
    const y = Math.max(30, Math.min(rect.height - 30, e.clientY - rect.top));

    onUpdateGraph({
      ...graph,
      positions: {
        ...positions,
        [draggingVertex]: { x: Math.round(x), y: Math.round(y) }
      }
    });
  };

  const handleMouseUp = () => {
    setDraggingVertex(null);
  };

  // Add vertex on canvas click
  const handleCanvasClick = (e) => {
    if (readOnly || !svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const x = Math.round(e.clientX - rect.left);
    const y = Math.round(e.clientY - rect.top);

    // Generate unique letter or ID
    const nextCode = 65 + vertices.length;
    const newName = nextCode <= 90 ? String.fromCharCode(nextCode) : `V${vertices.length + 1}`;

    onUpdateGraph({
      ...graph,
      vertices: [...vertices, newName],
      positions: { ...positions, [newName]: { x, y } }
    });
  };

  // Vertex click for edge creation
  const handleVertexClick = (v, e) => {
    e.stopPropagation();
    if (readOnly) {
      if (onSelectStart) onSelectStart(v);
      return;
    }

    if (!selectedVertex) {
      setSelectedVertex(v);
    } else if (selectedVertex === v) {
      setSelectedVertex(null);
    } else {
      // Connect edge from selectedVertex to v
      const exists = edges.some(
        e => (e.from === selectedVertex && e.to === v) ||
             (!directed && e.from === v && e.to === selectedVertex)
      );

      if (!exists) {
        onUpdateGraph({
          ...graph,
          edges: [
            ...edges,
            { from: selectedVertex, to: v, weight: Number(edgeWeightInput) || 1 }
          ]
        });
      }
      setSelectedVertex(null);
    }
  };

  // Remove vertex
  const handleRemoveVertex = (v, e) => {
    e.stopPropagation();
    if (readOnly) return;
    const nextVertices = vertices.filter(n => n !== v);
    const nextEdges = edges.filter(e => e.from !== v && e.to !== v);
    const nextPositions = { ...positions };
    delete nextPositions[v];

    onUpdateGraph({
      ...graph,
      vertices: nextVertices,
      edges: nextEdges,
      positions: nextPositions
    });
    if (selectedVertex === v) setSelectedVertex(null);
  };

  // Remove edge
  const handleRemoveEdge = (from, to, e) => {
    e.stopPropagation();
    if (readOnly) return;
    const nextEdges = edges.filter(
      ed => !(ed.from === from && ed.to === to) &&
            !(directed ? false : ed.from === to && ed.to === from)
    );
    onUpdateGraph({ ...graph, edges: nextEdges });
  };

  return (
    <div className="graph-editor-wrapper">
      {!readOnly && (
        <div className="graph-editor-toolbar">
          <div className="tool-tip-msg">
            Click empty space to <b>add vertex</b>. Click two vertices to <b>connect edge</b>. Drag nodes to reposition.
          </div>
          <div className="tool-controls-row">
            <label className="weight-input-label">
              Edge Weight:
              <input
                type="number"
                value={edgeWeightInput}
                onChange={e => setEdgeWeightInput(e.target.value)}
                className="edge-weight-input"
              />
            </label>
            <label className="check-label">
              <input
                type="checkbox"
                checked={directed}
                onChange={e => onUpdateGraph({ ...graph, directed: e.target.checked })}
              />
              Directed
            </label>
          </div>
        </div>
      )}

      <div
        className="graph-canvas-container"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        <svg
          ref={svgRef}
          className="graph-svg"
          viewBox="0 0 540 320"
          onClick={handleCanvasClick}
        >
          <defs>
            <marker
              id="arrowhead"
              markerWidth="10"
              markerHeight="7"
              refX="28"
              refY="3.5"
              orient="auto"
            >
              <polygon points="0 0, 10 3.5, 0 7" fill="#889284" />
            </marker>
            <marker
              id="arrowhead-active"
              markerWidth="10"
              markerHeight="7"
              refX="28"
              refY="3.5"
              orient="auto"
            >
              <polygon points="0 0, 10 3.5, 0 7" fill="#d58c56" />
            </marker>
            <marker
              id="arrowhead-mst"
              markerWidth="10"
              markerHeight="7"
              refX="28"
              refY="3.5"
              orient="auto"
            >
              <polygon points="0 0, 10 3.5, 0 7" fill="#4d9a70" />
            </marker>
          </defs>

          {/* Render Edges */}
          {edges.map((e, idx) => {
            const p1 = positions[e.from] || { x: 80 + (idx * 40) % 300, y: 80 };
            const p2 = positions[e.to] || { x: 180 + (idx * 40) % 300, y: 160 };

            const edgeKey1 = `${e.from}-${e.to}`;
            const edgeKey2 = `${e.to}-${e.from}`;
            const isActive = activeEdges.includes(edgeKey1) || (!directed && activeEdges.includes(edgeKey2));
            const isMST = mstEdges.includes(edgeKey1) || (!directed && mstEdges.includes(edgeKey2));

            let edgeClass = 'graph-edge';
            let markerId = 'arrowhead';
            if (isMST) {
              edgeClass += ' mst-edge';
              markerId = 'arrowhead-mst';
            } else if (isActive) {
              edgeClass += ' active-edge';
              markerId = 'arrowhead-active';
            }

            const midX = (p1.x + p2.x) / 2;
            const midY = (p1.y + p2.y) / 2;

            return (
              <g key={`${e.from}-${e.to}-${idx}`} className="edge-group">
                <line
                  x1={p1.x}
                  y1={p1.y}
                  x2={p2.x}
                  y2={p2.y}
                  className={edgeClass}
                  markerEnd={directed ? `url(#${markerId})` : undefined}
                />
                {/* Weight badge */}
                <rect
                  x={midX - 12}
                  y={midY - 9}
                  width="24"
                  height="18"
                  rx="4"
                  className="edge-weight-bg"
                  onClick={ev => handleRemoveEdge(e.from, e.to, ev)}
                  title="Click to remove edge"
                />
                <text
                  x={midX}
                  y={midY + 4}
                  textAnchor="middle"
                  className="edge-weight-text"
                  onClick={ev => handleRemoveEdge(e.from, e.to, ev)}
                >
                  {e.weight}
                </text>
              </g>
            );
          })}

          {/* Render Vertices */}
          {vertices.map(v => {
            const pos = positions[v] || { x: 120, y: 120 };
            const isCurrent = currentVertex === v;
            const isVisited = visited.includes(v);
            const isSelected = selectedVertex === v;
            const isStart = startVertex === v;

            let nodeClass = 'graph-node';
            if (isCurrent) nodeClass += ' current';
            else if (isVisited) nodeClass += ' visited';
            if (isSelected) nodeClass += ' connecting-source';

            return (
              <g
                key={v}
                className="vertex-group"
                transform={`translate(${pos.x}, ${pos.y})`}
                onMouseDown={e => handleMouseDown(v, e)}
                onClick={e => handleVertexClick(v, e)}
              >
                <circle r="22" className={nodeClass} />
                <text y="5" textAnchor="middle" className="graph-label">
                  {v}
                </text>
                {isStart && (
                  <text y="-26" textAnchor="middle" className="start-badge-svg">
                    START
                  </text>
                )}
                {!readOnly && (
                  <circle
                    cx="16"
                    cy="-16"
                    r="7"
                    className="delete-node-btn"
                    onClick={e => handleRemoveVertex(v, e)}
                    title={`Delete vertex ${v}`}
                  />
                )}
              </g>
            );
          })}
        </svg>
      </div>

      <div className="graph-foot">
        <span><i className="legend-dot active-dot" /> Current Node</span>
        <span><i className="legend-dot done-dot" /> Visited Node / MST</span>
        <span><i className="legend-dot compare-dot" /> Active Edge</span>
        {startVertex && <span className="graph-algo">Start Vertex: <b>{startVertex}</b></span>}
      </div>
    </div>
  );
}
