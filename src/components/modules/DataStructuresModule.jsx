import React, { useState, useMemo } from 'react';
import {
  ArrayLab, StackLab, QueueLab, CircularQueueLab, DequeLab,
  LinkedListLab, BSTLab, AVLTreeLab, HeapLab, HashTableLab
} from '../../data-structures/dataStructuresEngine.js';
import {
  StackVisualizer, QueueVisualizer, CircularQueueVisualizer,
  LinkedListVisualizer, HashTableVisualizer
} from '../visualizations/StructureVisualizers.jsx';
import { TreeVisualizer } from '../visualizations/TreeVisualizer.jsx';
import { ComplexityCard } from '../common/ComplexityCard.jsx';
import { ALGORITHMS_DATA } from '../../data/algorithms.js';
import { Plus, Trash2, Search, RotateCcw, ArrowRight, Play, Eye } from 'lucide-react';

export function DataStructuresModule() {
  const [selectedDS, setSelectedDS] = useState('Stack');
  const [inputValue, setInputValue] = useState('42');
  const [inputIndex, setInputIndex] = useState('1');
  const [logMessage, setLogMessage] = useState('Ready for operations.');
  const [activeIndices, setActiveIndices] = useState([]);

  // Persistent instances
  const [arrayLab, setArrayLab] = useState(() => new ArrayLab([12, 24, 36, 48, 60], 10));
  const [stackLab, setStackLab] = useState(() => new StackLab(7, [10, 20, 30]));
  const [queueLab, setQueueLab] = useState(() => new QueueLab(8, [15, 30, 45]));
  const [circQueueLab, setCircQueueLab] = useState(() => new CircularQueueLab(6));
  const [dequeLab, setDequeLab] = useState(() => new DequeLab(8, [20, 30, 40]));
  const [linkedListLab, setLinkedListLab] = useState(() => new LinkedListLab('singly', [10, 20, 30, 40]));
  const [bstLab, setBstLab] = useState(() => new BSTLab([40, 20, 60, 10, 30, 50, 70]));
  const [avlLab, setAvlLab] = useState(() => new AVLTreeLab([30, 20, 40, 10, 25]));
  const [heapLab, setHeapLab] = useState(() => new HeapLab('max', [50, 30, 20, 15, 10, 8, 16]));
  const [hashLab, setHashLab] = useState(() => new HashTableLab(7, 'chaining'));

  // Trigger re-render counter
  const [version, setVersion] = useState(0);
  const bump = () => setVersion(v => v + 1);

  const dsList = [
    'Array', 'Stack', 'Queue', 'Circular Queue', 'Deque',
    'Linked List (Singly)', 'Linked List (Doubly)', 'Linked List (Circular)',
    'Binary Search Tree', 'AVL Tree', 'Heap (Max-Heap)', 'Heap (Min-Heap)', 'Hash Table'
  ];

  return (
    <div className="ds-module-view">
      <div className="ds-selector-bar">
        <label className="field-label">SELECT DATA STRUCTURE</label>
        <div className="ds-chips-row">
          {dsList.map(name => (
            <button
              key={name}
              className={`ds-nav-chip ${selectedDS === name ? 'active' : ''}`}
              onClick={() => {
                setSelectedDS(name);
                setLogMessage(`Switched to ${name} laboratory.`);
                if (name.includes('Doubly')) setLinkedListLab(new LinkedListLab('doubly', [10, 20, 30, 40]));
                else if (name.includes('Circular') && name.includes('Linked')) setLinkedListLab(new LinkedListLab('circular-singly', [10, 20, 30]));
                else if (name.includes('Min-Heap')) setHeapLab(new HeapLab('min', [10, 20, 30, 40, 50]));
                else if (name.includes('Max-Heap')) setHeapLab(new HeapLab('max', [50, 40, 30, 20, 10]));
              }}
            >
              {name}
            </button>
          ))}
        </div>
      </div>

      <div className="workspace-grid">
        {/* Operations Control Panel */}
        <div className="panel input-panel">
          <div className="panel-head">
            <div>
              <span className="section-kicker">01 / OPERATIONS</span>
              <h2>{selectedDS} Controls</h2>
            </div>
          </div>

          <div className="op-inputs-row">
            <label className="field-label">VALUE</label>
            <input
              type="number"
              className="target-input"
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              placeholder="e.g. 42"
            />
            {['Array', 'Linked List (Singly)', 'Linked List (Doubly)'].includes(selectedDS) && (
              <>
                <label className="field-label" style={{ marginTop: '10px' }}>INDEX / POSITION</label>
                <input
                  type="number"
                  className="target-input"
                  value={inputIndex}
                  onChange={e => setInputIndex(e.target.value)}
                  placeholder="e.g. 0"
                />
              </>
            )}
          </div>

          {/* Dynamic Buttons depending on selected Data Structure */}
          <div className="ds-action-buttons">
            {selectedDS === 'Array' && (
              <>
                <button className="op-btn" onClick={() => { const res = arrayLab.insert(inputIndex, inputValue); setLogMessage(res.message); bump(); }}>
                  <Plus size={14} /> Insert at Index
                </button>
                <button className="op-btn" onClick={() => { const res = arrayLab.delete(inputIndex); setLogMessage(res.message); bump(); }}>
                  <Trash2 size={14} /> Delete at Index
                </button>
                <button className="op-btn" onClick={() => { const res = arrayLab.update(inputIndex, inputValue); setLogMessage(res.message); bump(); }}>
                  Update at Index
                </button>
                <button className="op-btn" onClick={() => { const res = arrayLab.access(inputIndex); setLogMessage(res.message); bump(); }}>
                  Access by Index
                </button>
                <button className="op-btn" onClick={() => { const res = arrayLab.search(inputValue); setLogMessage(res.message); bump(); }}>
                  <Search size={14} /> Search Value
                </button>
              </>
            )}

            {selectedDS === 'Stack' && (
              <>
                <button className="op-btn primary" onClick={() => { const res = stackLab.push(inputValue); setLogMessage(res.message); bump(); }}>
                  <Plus size={14} /> Push ({inputValue})
                </button>
                <button className="op-btn" onClick={() => { const res = stackLab.pop(); setLogMessage(res.message); bump(); }}>
                  <Trash2 size={14} /> Pop (LIFO)
                </button>
                <button className="op-btn" onClick={() => { const res = stackLab.peek(); setLogMessage(res.message); bump(); }}>
                  <Eye size={14} /> Peek TOP
                </button>
                <button className="op-btn" onClick={() => { setStackLab(new StackLab(7, [])); setLogMessage('Stack reset to empty.'); bump(); }}>
                  <RotateCcw size={14} /> Clear Stack
                </button>
              </>
            )}

            {selectedDS === 'Queue' && (
              <>
                <button className="op-btn primary" onClick={() => { const res = queueLab.enqueue(inputValue); setLogMessage(res.message); bump(); }}>
                  <Plus size={14} /> Enqueue ({inputValue})
                </button>
                <button className="op-btn" onClick={() => { const res = queueLab.dequeue(); setLogMessage(res.message); bump(); }}>
                  <Trash2 size={14} /> Dequeue (FIFO)
                </button>
                <button className="op-btn" onClick={() => { const res = queueLab.peekFront(); setLogMessage(res.message); bump(); }}>
                  Peek FRONT
                </button>
                <button className="op-btn" onClick={() => { const res = queueLab.peekRear(); setLogMessage(res.message); bump(); }}>
                  Peek REAR
                </button>
              </>
            )}

            {selectedDS === 'Circular Queue' && (
              <>
                <button className="op-btn primary" onClick={() => { const res = circQueueLab.enqueue(inputValue); setLogMessage(res.message); bump(); }}>
                  <Plus size={14} /> Enqueue ({inputValue})
                </button>
                <button className="op-btn" onClick={() => { const res = circQueueLab.dequeue(); setLogMessage(res.message); bump(); }}>
                  <Trash2 size={14} /> Dequeue
                </button>
                <button className="op-btn" onClick={() => { setCircQueueLab(new CircularQueueLab(6)); setLogMessage('Circular buffer reset.'); bump(); }}>
                  <RotateCcw size={14} /> Reset Ring Buffer
                </button>
              </>
            )}

            {selectedDS === 'Deque' && (
              <>
                <button className="op-btn" onClick={() => { const res = dequeLab.insertFront(inputValue); setLogMessage(res.message); bump(); }}>
                  Insert FRONT
                </button>
                <button className="op-btn" onClick={() => { const res = dequeLab.insertRear(inputValue); setLogMessage(res.message); bump(); }}>
                  Insert REAR
                </button>
                <button className="op-btn" onClick={() => { const res = dequeLab.deleteFront(); setLogMessage(res.message); bump(); }}>
                  Delete FRONT
                </button>
                <button className="op-btn" onClick={() => { const res = dequeLab.deleteRear(); setLogMessage(res.message); bump(); }}>
                  Delete REAR
                </button>
              </>
            )}

            {selectedDS.includes('Linked List') && (
              <>
                <button className="op-btn primary" onClick={() => { const res = linkedListLab.insertBeginning(inputValue); setLogMessage(res.message); bump(); }}>
                  Insert HEAD
                </button>
                <button className="op-btn" onClick={() => { const res = linkedListLab.insertEnd(inputValue); setLogMessage(res.message); bump(); }}>
                  Insert TAIL
                </button>
                <button className="op-btn" onClick={() => { const res = linkedListLab.insertAtPosition(inputIndex, inputValue); setLogMessage(res.message); bump(); }}>
                  Insert at Pos {inputIndex}
                </button>
                <button className="op-btn" onClick={() => { const res = linkedListLab.deleteValue(inputValue); setLogMessage(res.message); bump(); }}>
                  Delete Value ({inputValue})
                </button>
                <button className="op-btn" onClick={() => { const res = linkedListLab.reverse(); setLogMessage(res.message); bump(); }}>
                  Reverse List
                </button>
              </>
            )}

            {selectedDS === 'Binary Search Tree' && (
              <>
                <button className="op-btn primary" onClick={() => { const res = bstLab.insert(inputValue); setLogMessage(res.message); bump(); }}>
                  <Plus size={14} /> Insert ({inputValue})
                </button>
                <button className="op-btn" onClick={() => { const res = bstLab.search(inputValue); setLogMessage(res.message); bump(); }}>
                  <Search size={14} /> Search ({inputValue})
                </button>
                <button className="op-btn" onClick={() => { const res = bstLab.delete(inputValue); setLogMessage(res.message); bump(); }}>
                  <Trash2 size={14} /> Delete ({inputValue})
                </button>
                <button className="op-btn" onClick={() => { const arr = bstLab.inorder(); setLogMessage(`Inorder (sorted): [${arr.join(', ')}]`); bump(); }}>
                  Inorder Traversal
                </button>
                <button className="op-btn" onClick={() => { const arr = bstLab.levelOrder(); setLogMessage(`Level-order (BFS): [${arr.join(', ')}]`); bump(); }}>
                  Level-Order
                </button>
              </>
            )}

            {selectedDS === 'AVL Tree' && (
              <>
                <button className="op-btn primary" onClick={() => { const res = avlLab.insert(inputValue); setLogMessage(res.message); bump(); }}>
                  <Plus size={14} /> Insert ({inputValue})
                </button>
                <button className="op-btn" onClick={() => { setAvlLab(new AVLTreeLab([30, 20, 40, 10, 25])); setLogMessage('AVL Tree reset.'); bump(); }}>
                  <RotateCcw size={14} /> Reset AVL Tree
                </button>
              </>
            )}

            {selectedDS.includes('Heap') && (
              <>
                <button className="op-btn primary" onClick={() => { const res = heapLab.insert(inputValue); setLogMessage(res.message); bump(); }}>
                  <Plus size={14} /> Insert ({inputValue})
                </button>
                <button className="op-btn" onClick={() => { const res = heapLab.extract(); setLogMessage(res.message); bump(); }}>
                  <Trash2 size={14} /> Extract Root
                </button>
                <button className="op-btn" onClick={() => { const res = heapLab.peek(); setLogMessage(res.message); bump(); }}>
                  <Eye size={14} /> Peek Extremum
                </button>
              </>
            )}

            {selectedDS === 'Hash Table' && (
              <>
                <div className="field-label" style={{ marginTop: '8px' }}>STRATEGY:</div>
                <div className="preset-row" style={{ marginBottom: '10px' }}>
                  {['chaining', 'linear', 'quadratic', 'double'].map(st => (
                    <button
                      key={st}
                      className={hashLab.strategy === st ? 'active-preset' : ''}
                      onClick={() => {
                        setHashLab(new HashTableLab(7, st));
                        setLogMessage(`Switched collision mode to ${st.toUpperCase()}. Table cleared.`);
                        bump();
                      }}
                    >
                      {st}
                    </button>
                  ))}
                </div>
                <button className="op-btn primary" onClick={() => { const res = hashLab.insert(inputValue); setLogMessage(res.message); bump(); }}>
                  <Plus size={14} /> Insert Key ({inputValue})
                </button>
                <button className="op-btn" onClick={() => { const res = hashLab.search(inputValue); setLogMessage(res.message); bump(); }}>
                  <Search size={14} /> Search Key ({inputValue})
                </button>
                <button className="op-btn" onClick={() => { const res = hashLab.delete(inputValue); setLogMessage(res.message); bump(); }}>
                  <Trash2 size={14} /> Delete Key ({inputValue})
                </button>
              </>
            )}
          </div>

          <div className="step-message" style={{ marginTop: '16px' }}>
            <div>
              <small>OPERATION LOG</small>
              <p>{logMessage}</p>
            </div>
          </div>
        </div>

        {/* Live Visualization Canvas */}
        <div className="panel viz-panel">
          <div className="panel-head">
            <div>
              <span className="section-kicker">02 / VISUALIZE</span>
              <h2>{selectedDS} Live Memory Model</h2>
            </div>
            <div className="canvas-badge"><span className="live-dot" /> INTERACTIVE STATE</div>
          </div>

          {selectedDS === 'Array' && (
            <div className="array-canvas">
              <div className="array-bars">
                {arrayLab.elements.map((v, i) => (
                  <div key={i} className="bar-column">
                    <div className="bar-value">{v}</div>
                    <div className="bar" style={{ height: `${Math.max(15, (v / 80) * 100)}%` }} />
                    <span className="bar-index">{i}</span>
                  </div>
                ))}
              </div>
              <div className="array-axis">
                <span>0-BASED INDEX</span>
                <span>{arrayLab.elements.length} / {arrayLab.capacity} ITEMS</span>
              </div>
            </div>
          )}

          {selectedDS === 'Stack' && (
            <StackVisualizer items={stackLab.items} capacity={stackLab.capacity} />
          )}

          {selectedDS === 'Queue' && (
            <QueueVisualizer items={queueLab.items} capacity={queueLab.capacity} />
          )}

          {selectedDS === 'Circular Queue' && (
            <CircularQueueVisualizer
              buffer={circQueueLab.buffer}
              front={circQueueLab.front}
              rear={circQueueLab.rear}
              capacity={circQueueLab.capacity}
            />
          )}

          {selectedDS === 'Deque' && (
            <QueueVisualizer items={dequeLab.items} capacity={dequeLab.capacity} />
          )}

          {selectedDS.includes('Linked List') && (
            <LinkedListVisualizer
              nodes={linkedListLab.toArray()}
              kind={linkedListLab.kind}
            />
          )}

          {selectedDS === 'Binary Search Tree' && (
            <TreeVisualizer tree={bstLab.toHierarchy()} />
          )}

          {selectedDS === 'AVL Tree' && (
            <TreeVisualizer tree={avlLab.toHierarchy()} isAVL={true} />
          )}

          {selectedDS.includes('Heap') && (
            <div className="heap-view-container">
              <div className="heap-array-row">
                {heapLab.heap.map((val, idx) => (
                  <div key={idx} className="heap-item-box">
                    <small>Idx {idx}</small>
                    <strong>{val}</strong>
                    {idx === 0 && <span className="root-tag">ROOT</span>}
                  </div>
                ))}
              </div>
              <div className="structure-label" style={{ textAlign: 'center', marginTop: '12px' }}>
                Array Representation: Parent at floor((i - 1) / 2), Left Child at 2i + 1, Right Child at 2i + 2
              </div>
            </div>
          )}

          {selectedDS === 'Hash Table' && (
            <HashTableVisualizer table={hashLab.table} strategy={hashLab.strategy} />
          )}
        </div>
      </div>

      <div style={{ marginTop: '16px' }}>
        <ComplexityCard data={ALGORITHMS_DATA[selectedDS] || ALGORITHMS_DATA['Stack']} />
      </div>
    </div>
  );
}
