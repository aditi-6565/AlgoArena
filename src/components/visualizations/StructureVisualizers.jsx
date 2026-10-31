import React from 'react';
import { ArrowDown, ArrowRight, ArrowLeft, RotateCw } from 'lucide-react';

export function StackVisualizer({ items = [], capacity = 7 }) {
  const emptySlots = Math.max(0, capacity - items.length);

  return (
    <div className="structure-canvas stack-view">
      <div className="structure-label">TOP OF STACK ↓ (LIFO: Last In, First Out)</div>
      <div className="stack-container">
        {/* Render empty capacity slots */}
        {Array.from({ length: emptySlots }).map((_, i) => (
          <div key={`empty-${i}`} className="stack-slot empty">
            <span className="slot-idx">{capacity - 1 - i}</span>
            <span className="slot-placeholder">empty</span>
          </div>
        ))}
        {/* Render actual stack items from top to bottom */}
        {[...items].reverse().map((val, idx) => {
          const actualIdx = items.length - 1 - idx;
          const isTop = actualIdx === items.length - 1;
          return (
            <div key={`item-${actualIdx}`} className={`stack-slot filled ${isTop ? 'top-item' : ''}`}>
              <span className="slot-idx">{actualIdx}</span>
              <strong className="slot-val">{val}</strong>
              {isTop && <span className="top-badge">TOP</span>}
            </div>
          );
        })}
      </div>
      <div className="structure-stats">
        <span>Capacity: {capacity}</span>
        <span>Current Size: {items.length}</span>
        <span>{items.length === 0 ? 'STATUS: EMPTY' : items.length === capacity ? 'STATUS: FULL' : 'STATUS: READY'}</span>
      </div>
    </div>
  );
}

export function QueueVisualizer({ items = [], capacity = 8 }) {
  return (
    <div className="structure-canvas queue-view">
      <div className="queue-direction-header">
        <span>FRONT (Dequeue) ←</span>
        <span>FIFO: First In, First Out</span>
        <span>← REAR (Enqueue)</span>
      </div>
      <div className="queue-pipeline">
        {items.length === 0 ? (
          <div className="queue-empty-msg">Queue is currently empty.</div>
        ) : (
          items.map((val, idx) => {
            const isFront = idx === 0;
            const isRear = idx === items.length - 1;
            return (
              <div key={idx} className={`queue-node ${isFront ? 'front-node' : ''} ${isRear ? 'rear-node' : ''}`}>
                {isFront && <span className="queue-tag front-tag">FRONT</span>}
                <div className="node-box">{val}</div>
                {isRear && <span className="queue-tag rear-tag">REAR</span>}
                <span className="node-index-tag">[{idx}]</span>
              </div>
            );
          })
        )}
      </div>
      <div className="structure-stats">
        <span>Capacity: {capacity}</span>
        <span>Current Elements: {items.length}</span>
      </div>
    </div>
  );
}

export function CircularQueueVisualizer({ buffer = [], front = -1, rear = -1, capacity = 6 }) {
  return (
    <div className="structure-canvas circular-queue-view">
      <div className="structure-label">
        <RotateCw size={13} className="spin-slow" /> CIRCULAR BUFFER WITH WRAPAROUND: (rear + 1) % {capacity}
      </div>
      <div className="circular-buffer-grid">
        {buffer.map((val, idx) => {
          const isFront = idx === front;
          const isRear = idx === rear;
          const isOccupied = val !== null;

          return (
            <div key={idx} className={`circ-slot ${isOccupied ? 'occupied' : 'vacant'} ${isFront ? 'is-front' : ''} ${isRear ? 'is-rear' : ''}`}>
              <div className="circ-idx">Idx {idx}</div>
              <strong className="circ-val">{isOccupied ? val : '—'}</strong>
              <div className="circ-tags">
                {isFront && <span className="tag-front">FRONT</span>}
                {isRear && <span className="tag-rear">REAR</span>}
              </div>
            </div>
          );
        })}
      </div>
      <div className="structure-stats">
        <span>FRONT Pointer: {front}</span>
        <span>REAR Pointer: {rear}</span>
        <span>Buffer Size: {capacity}</span>
      </div>
    </div>
  );
}

export function LinkedListVisualizer({ nodes = [], kind = 'singly' }) {
  const isDoubly = kind.includes('doubly');
  const isCircular = kind.includes('circular');

  return (
    <div className="structure-canvas linkedlist-view">
      <div className="structure-label">
        {kind.toUpperCase()} LINKED LIST (HEAD → {isCircular ? 'CIRCULAR LOOP' : 'NULL'})
      </div>
      <div className="linkedlist-chain">
        {nodes.length === 0 ? (
          <div className="queue-empty-msg">List is empty. Insert nodes from the controls.</div>
        ) : (
          nodes.map((n, idx) => {
            const isHead = idx === 0;
            const isTail = idx === nodes.length - 1;
            return (
              <React.Fragment key={n.id || idx}>
                <div className={`ll-node-card ${isHead ? 'head-card' : ''} ${isTail ? 'tail-card' : ''}`}>
                  {isHead && <span className="ll-pointer-label head-lbl">HEAD</span>}
                  <div className="ll-node-body">
                    <span className="ll-data-field">{n.val}</span>
                    <span className="ll-next-field">●</span>
                  </div>
                  {isTail && <span className="ll-pointer-label tail-lbl">TAIL</span>}
                  <span className="ll-idx-tag">pos: {idx}</span>
                </div>
                {!isTail && (
                  <div className="ll-arrow-connector">
                    {isDoubly ? '⇄' : '→'}
                  </div>
                )}
                {isTail && !isCircular && (
                  <div className="ll-null-terminator">→ NULL</div>
                )}
              </React.Fragment>
            );
          })
        )}
      </div>
      {isCircular && nodes.length > 0 && (
        <div className="circular-return-arrow">
          ⮌ TAIL references back to HEAD ({nodes[0]?.val})
        </div>
      )}
    </div>
  );
}

export function HashTableVisualizer({ table = [], strategy = 'chaining' }) {
  return (
    <div className="structure-canvas hash-table-view">
      <div className="structure-label">
        HASH TABLE ({strategy.toUpperCase()} COLLISION RESOLUTION)
      </div>
      <div className="hash-buckets-list">
        {table.map((bucket, idx) => {
          return (
            <div key={idx} className="hash-bucket-row">
              <div className="bucket-index-tag">Bucket [{idx}]</div>
              <div className="bucket-content">
                {strategy === 'chaining' ? (
                  (bucket || []).length === 0 ? (
                    <span className="empty-chain-text">empty (null)</span>
                  ) : (
                    bucket.map((val, cIdx) => (
                      <React.Fragment key={cIdx}>
                        <span className="chain-node">{val}</span>
                        {cIdx < bucket.length - 1 && <span className="chain-arrow">→</span>}
                      </React.Fragment>
                    ))
                  )
                ) : (
                  <span className={`open-address-cell ${bucket === 'DELETED' ? 'tombstone' : bucket !== null ? 'filled' : 'vacant'}`}>
                    {bucket === null ? 'empty' : bucket === 'DELETED' ? 'DELETED (Tombstone)' : bucket}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
