import React from 'react';

export function TreeVisualizer({ tree, activePath = [], isAVL = false }) {
  if (!tree) {
    return (
      <div className="tree-canvas empty">
        <span>Tree is currently empty. Insert elements to construct nodes.</span>
      </div>
    );
  }

  // Calculate coordinates recursively
  const renderNode = (node, x, y, dx, level = 0) => {
    if (!node) return null;

    const isActive = activePath.includes(node.val);
    const leftX = x - dx;
    const rightX = x + dx;
    const nextY = y + 60;
    const nextDx = Math.max(22, dx / 1.85);

    return (
      <g key={`${node.val}-${level}-${x}`}>
        {/* Branch Lines */}
        {node.left && (
          <line
            x1={x}
            y1={y}
            x2={leftX}
            y2={nextY}
            className={`tree-branch-line ${isActive ? 'active-branch' : ''}`}
          />
        )}
        {node.right && (
          <line
            x1={x}
            y1={y}
            x2={rightX}
            y2={nextY}
            className={`tree-branch-line ${isActive ? 'active-branch' : ''}`}
          />
        )}

        {/* Child subtrees */}
        {node.left && renderNode(node.left, leftX, nextY, nextDx, level + 1)}
        {node.right && renderNode(node.right, rightX, nextY, nextDx, level + 1)}

        {/* Node Circle */}
        <circle
          cx={x}
          cy={y}
          r="19"
          className={`tree-node-circle ${isActive ? 'active-tree-node' : ''} ${level === 0 ? 'root-node' : ''}`}
        />
        <text
          x={x}
          y={y + 5}
          textAnchor="middle"
          className="tree-node-val"
        >
          {node.val}
        </text>

        {/* AVL Balance Factor & Height Tag */}
        {isAVL && (
          <text
            x={x}
            y={y - 23}
            textAnchor="middle"
            className="tree-node-bf"
          >
            BF: {node.balance !== undefined ? (node.balance >= 0 ? `+${node.balance}` : node.balance) : 0}
          </text>
        )}
      </g>
    );
  };

  return (
    <div className="tree-canvas-wrapper">
      <svg className="tree-svg" viewBox="0 0 540 280">
        {renderNode(tree, 270, 45, 110)}
      </svg>
      <div className="tree-legend-row">
        <span><i className="legend-dot root-dot" /> Root Node</span>
        <span><i className="legend-dot active-dot" /> Traversal Path / Search</span>
        {isAVL && <span><i className="legend-dot done-dot" /> Balance Factor (BF = Height(L) - Height(R))</span>}
      </div>
    </div>
  );
}
