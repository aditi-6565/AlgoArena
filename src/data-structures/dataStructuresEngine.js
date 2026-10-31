// AlgoArena Interactive Data Structures Engine
// Real operational state mutations, boundary checks, and animation step metadata

// ==========================================
// 1. ARRAY OPERATIONS
// ==========================================
export class ArrayLab {
  constructor(initial = [12, 24, 36, 48, 60], capacity = 10) {
    this.elements = [...initial];
    this.capacity = capacity;
  }

  insert(index, value) {
    if (this.elements.length >= this.capacity) {
      return { success: false, message: `Overflow: Array is at maximum capacity (${this.capacity}).` };
    }
    const idx = Number(index);
    if (isNaN(idx) || idx < 0 || idx > this.elements.length) {
      return { success: false, message: `Invalid index: must be between 0 and ${this.elements.length}.` };
    }
    this.elements.splice(idx, 0, Number(value));
    return {
      success: true,
      message: `Inserted value ${value} at index ${idx}. Shifted right elements.`,
      active: [idx],
      elements: [...this.elements]
    };
  }

  delete(index) {
    const idx = Number(index);
    if (this.elements.length === 0) {
      return { success: false, message: 'Underflow: Array is currently empty.' };
    }
    if (isNaN(idx) || idx < 0 || idx >= this.elements.length) {
      return { success: false, message: `Invalid index: must be between 0 and ${this.elements.length - 1}.` };
    }
    const removed = this.elements.splice(idx, 1)[0];
    return {
      success: true,
      message: `Deleted element ${removed} from index ${idx}. Shifted remaining elements left.`,
      active: [Math.max(0, idx - 1)],
      elements: [...this.elements]
    };
  }

  update(index, value) {
    const idx = Number(index);
    if (isNaN(idx) || idx < 0 || idx >= this.elements.length) {
      return { success: false, message: `Invalid index: must be between 0 and ${this.elements.length - 1}.` };
    }
    const prev = this.elements[idx];
    this.elements[idx] = Number(value);
    return {
      success: true,
      message: `Updated index ${idx} from ${prev} to ${value}.`,
      active: [idx],
      elements: [...this.elements]
    };
  }

  search(value) {
    const target = Number(value);
    const idx = this.elements.indexOf(target);
    if (idx !== -1) {
      return {
        success: true,
        message: `Found value ${target} at index ${idx}.`,
        active: [idx],
        elements: [...this.elements]
      };
    }
    return {
      success: false,
      message: `Value ${target} was not found in the array.`,
      active: [],
      elements: [...this.elements]
    };
  }

  access(index) {
    const idx = Number(index);
    if (isNaN(idx) || idx < 0 || idx >= this.elements.length) {
      return { success: false, message: `Access out of bounds: index ${idx} does not exist.` };
    }
    return {
      success: true,
      message: `A[${idx}] = ${this.elements[idx]} (direct O(1) memory offset access).`,
      active: [idx],
      elements: [...this.elements]
    };
  }
}

// ==========================================
// 2. STACK (LIFO)
// ==========================================
export class StackLab {
  constructor(capacity = 7, initial = [10, 20, 30]) {
    this.items = [...initial];
    this.capacity = capacity;
  }

  push(value) {
    if (this.isFull()) {
      return { success: false, message: `Stack Overflow: Cannot push ${value}, maximum capacity (${this.capacity}) reached!` };
    }
    this.items.push(Number(value));
    return {
      success: true,
      message: `Pushed ${value} onto TOP of stack (index ${this.items.length - 1}).`,
      active: [this.items.length - 1],
      items: [...this.items]
    };
  }

  pop() {
    if (this.isEmpty()) {
      return { success: false, message: 'Stack Underflow: Cannot pop from an empty stack!' };
    }
    const removed = this.items.pop();
    return {
      success: true,
      message: `Popped ${removed} from TOP of stack. LIFO policy applied.`,
      active: [this.items.length - 1],
      items: [...this.items]
    };
  }

  peek() {
    if (this.isEmpty()) {
      return { success: false, message: 'Stack is empty: No element to peek.' };
    }
    const top = this.items[this.items.length - 1];
    return {
      success: true,
      message: `TOP element is ${top} at index ${this.items.length - 1}.`,
      active: [this.items.length - 1],
      items: [...this.items]
    };
  }

  isEmpty() {
    return this.items.length === 0;
  }

  isFull() {
    return this.items.length >= this.capacity;
  }
}

// ==========================================
// 3. QUEUE (FIFO) & CIRCULAR QUEUE & DEQUE
// ==========================================
export class QueueLab {
  constructor(capacity = 8, initial = [15, 30, 45]) {
    this.items = [...initial];
    this.capacity = capacity;
  }

  enqueue(val) {
    if (this.items.length >= this.capacity) {
      return { success: false, message: `Queue Overflow: Capacity limit (${this.capacity}) reached.` };
    }
    this.items.push(Number(val));
    return {
      success: true,
      message: `Enqueued ${val} at REAR (index ${this.items.length - 1}).`,
      active: [this.items.length - 1],
      items: [...this.items]
    };
  }

  dequeue() {
    if (this.items.length === 0) {
      return { success: false, message: 'Queue Underflow: Queue is currently empty.' };
    }
    const removed = this.items.shift();
    return {
      success: true,
      message: `Dequeued ${removed} from FRONT. FIFO policy applied.`,
      active: [0],
      items: [...this.items]
    };
  }

  peekFront() {
    if (this.items.length === 0) return { success: false, message: 'Queue is empty.' };
    return { success: true, message: `FRONT element is ${this.items[0]}.`, active: [0], items: [...this.items] };
  }

  peekRear() {
    if (this.items.length === 0) return { success: false, message: 'Queue is empty.' };
    const r = this.items.length - 1;
    return { success: true, message: `REAR element is ${this.items[r]}.`, active: [r], items: [...this.items] };
  }
}

export class CircularQueueLab {
  constructor(capacity = 6) {
    this.capacity = capacity;
    this.buffer = new Array(capacity).fill(null);
    this.front = -1;
    this.rear = -1;
    this.size = 0;
  }

  enqueue(val) {
    if (this.size === this.capacity) {
      return { success: false, message: `Circular Queue Overflow: Ring buffer is full (${this.capacity}/${this.capacity}).` };
    }
    if (this.front === -1) {
      this.front = 0;
      this.rear = 0;
    } else {
      this.rear = (this.rear + 1) % this.capacity;
    }
    this.buffer[this.rear] = Number(val);
    this.size++;
    return {
      success: true,
      message: `Enqueued ${val} at position ${this.rear} via (rear + 1) % ${this.capacity}.`,
      buffer: [...this.buffer],
      front: this.front,
      rear: this.rear,
      size: this.size
    };
  }

  dequeue() {
    if (this.size === 0) {
      return { success: false, message: 'Circular Queue Underflow: Queue is empty.' };
    }
    const removed = this.buffer[this.front];
    this.buffer[this.front] = null;
    this.size--;
    const oldFront = this.front;
    if (this.size === 0) {
      this.front = -1;
      this.rear = -1;
    } else {
      this.front = (this.front + 1) % this.capacity;
    }
    return {
      success: true,
      message: `Dequeued ${removed} from index ${oldFront}. Advanced front to ${this.front}.`,
      buffer: [...this.buffer],
      front: this.front,
      rear: this.rear,
      size: this.size
    };
  }
}

export class DequeLab {
  constructor(capacity = 8, initial = [20, 30, 40]) {
    this.items = [...initial];
    this.capacity = capacity;
  }

  insertFront(val) {
    if (this.items.length >= this.capacity) return { success: false, message: 'Deque Overflow.' };
    this.items.unshift(Number(val));
    return { success: true, message: `Inserted ${val} at FRONT.`, active: [0], items: [...this.items] };
  }

  insertRear(val) {
    if (this.items.length >= this.capacity) return { success: false, message: 'Deque Overflow.' };
    this.items.push(Number(val));
    return { success: true, message: `Inserted ${val} at REAR.`, active: [this.items.length - 1], items: [...this.items] };
  }

  deleteFront() {
    if (this.items.length === 0) return { success: false, message: 'Deque Underflow.' };
    const val = this.items.shift();
    return { success: true, message: `Deleted ${val} from FRONT.`, items: [...this.items] };
  }

  deleteRear() {
    if (this.items.length === 0) return { success: false, message: 'Deque Underflow.' };
    const val = this.items.pop();
    return { success: true, message: `Deleted ${val} from REAR.`, items: [...this.items] };
  }
}

// ==========================================
// 4. LINKED LISTS (Singly, Doubly, Circular)
// ==========================================
class LLNode {
  constructor(val) {
    this.id = Math.random().toString(36).substr(2, 9);
    this.val = Number(val);
    this.next = null;
    this.prev = null;
  }
}

export class LinkedListLab {
  constructor(kind = 'singly', initial = [10, 20, 30, 40]) {
    this.kind = kind; // 'singly', 'doubly', 'circular-singly', 'circular-doubly'
    this.head = null;
    this.tail = null;
    this.size = 0;
    initial.forEach(v => this.insertEnd(v));
  }

  toArray() {
    const list = [];
    if (!this.head) return list;
    let curr = this.head;
    let count = 0;
    while (curr && count < this.size) {
      list.push({ id: curr.id, val: curr.val });
      curr = curr.next;
      count++;
    }
    return list;
  }

  insertBeginning(val) {
    const node = new LLNode(val);
    if (!this.head) {
      this.head = node;
      this.tail = node;
      if (this.kind.includes('circular')) {
        node.next = node;
        if (this.kind.includes('doubly')) node.prev = node;
      }
    } else {
      node.next = this.head;
      if (this.kind.includes('doubly')) {
        this.head.prev = node;
      }
      if (this.kind.includes('circular')) {
        this.tail.next = node;
        if (this.kind.includes('doubly')) node.prev = this.tail;
      }
      this.head = node;
    }
    this.size++;
    return { success: true, message: `Inserted ${val} at HEAD.`, nodes: this.toArray() };
  }

  insertEnd(val) {
    const node = new LLNode(val);
    if (!this.head) {
      this.head = node;
      this.tail = node;
      if (this.kind.includes('circular')) {
        node.next = node;
        if (this.kind.includes('doubly')) node.prev = node;
      }
    } else {
      this.tail.next = node;
      if (this.kind.includes('doubly')) {
        node.prev = this.tail;
      }
      this.tail = node;
      if (this.kind.includes('circular')) {
        this.tail.next = this.head;
        if (this.kind.includes('doubly')) this.head.prev = this.tail;
      }
    }
    this.size++;
    return { success: true, message: `Inserted ${val} at TAIL.`, nodes: this.toArray() };
  }

  insertAtPosition(pos, val) {
    const p = Number(pos);
    if (p < 0 || p > this.size) return { success: false, message: `Position out of range [0..${this.size}].` };
    if (p === 0) return this.insertBeginning(val);
    if (p === this.size) return this.insertEnd(val);

    const node = new LLNode(val);
    let curr = this.head;
    for (let i = 0; i < p - 1; i++) {
      curr = curr.next;
    }
    node.next = curr.next;
    if (this.kind.includes('doubly') && curr.next) {
      curr.next.prev = node;
      node.prev = curr;
    }
    curr.next = node;
    this.size++;
    return { success: true, message: `Inserted ${val} at position ${p}.`, nodes: this.toArray() };
  }

  deleteValue(val) {
    const target = Number(val);
    if (!this.head) return { success: false, message: 'List is empty.' };

    if (this.head.val === target) {
      return this.deleteAtPosition(0);
    }

    let curr = this.head;
    let idx = 0;
    while (curr.next && (idx < this.size - 1)) {
      if (curr.next.val === target) {
        const deleted = curr.next;
        curr.next = deleted.next;
        if (this.kind.includes('doubly') && deleted.next) {
          deleted.next.prev = curr;
        }
        if (deleted === this.tail) {
          this.tail = curr;
          if (this.kind.includes('circular')) {
            this.tail.next = this.head;
            if (this.kind.includes('doubly')) this.head.prev = this.tail;
          }
        }
        this.size--;
        return { success: true, message: `Deleted node with value ${target}.`, nodes: this.toArray() };
      }
      curr = curr.next;
      idx++;
    }
    return { success: false, message: `Value ${target} not found in linked list.` };
  }

  deleteAtPosition(pos) {
    const p = Number(pos);
    if (p < 0 || p >= this.size || !this.head) return { success: false, message: 'Invalid deletion position.' };

    if (p === 0) {
      const removedVal = this.head.val;
      if (this.size === 1) {
        this.head = null;
        this.tail = null;
      } else {
        this.head = this.head.next;
        if (this.kind.includes('circular')) {
          this.tail.next = this.head;
          if (this.kind.includes('doubly')) this.head.prev = this.tail;
        }
        if (this.kind.includes('doubly') && !this.kind.includes('circular')) {
          this.head.prev = null;
        }
      }
      this.size--;
      return { success: true, message: `Deleted HEAD node (${removedVal}).`, nodes: this.toArray() };
    }

    let curr = this.head;
    for (let i = 0; i < p - 1; i++) {
      curr = curr.next;
    }
    const removedVal = curr.next.val;
    if (curr.next === this.tail) {
      this.tail = curr;
      if (this.kind.includes('circular')) {
        this.tail.next = this.head;
        if (this.kind.includes('doubly')) this.head.prev = this.tail;
      } else {
        this.tail.next = null;
      }
    } else {
      curr.next = curr.next.next;
      if (this.kind.includes('doubly') && curr.next) {
        curr.next.prev = curr;
      }
    }
    this.size--;
    return { success: true, message: `Deleted node at position ${p} (value ${removedVal}).`, nodes: this.toArray() };
  }

  reverse() {
    if (this.size <= 1) return { success: true, message: 'List has 1 or fewer nodes; already reversed.', nodes: this.toArray() };
    if (this.kind.includes('circular')) {
      return { success: false, message: 'In-place reverse is demonstrated for standard linear lists.' };
    }

    let prev = null;
    let curr = this.head;
    this.tail = this.head;
    while (curr) {
      const next = curr.next;
      curr.next = prev;
      if (this.kind.includes('doubly')) curr.prev = next;
      prev = curr;
      curr = next;
    }
    this.head = prev;
    return { success: true, message: 'Reversed all linked list pointers.', nodes: this.toArray() };
  }
}

// ==========================================
// 5. BINARY SEARCH TREE (BST)
// ==========================================
class BSTNode {
  constructor(val) {
    this.val = Number(val);
    this.left = null;
    this.right = null;
  }
}

export class BSTLab {
  constructor(initial = [40, 20, 60, 10, 30, 50, 70]) {
    this.root = null;
    initial.forEach(v => this.insert(v));
  }

  insert(val) {
    const v = Number(val);
    const insertNode = (node) => {
      if (!node) return new BSTNode(v);
      if (v < node.val) node.left = insertNode(node.left);
      else if (v > node.val) node.right = insertNode(node.right);
      return node;
    };
    this.root = insertNode(this.root);
    return { success: true, message: `Inserted ${v} into BST following BST invariant.`, tree: this.toHierarchy() };
  }

  search(val) {
    const v = Number(val);
    let curr = this.root;
    const path = [];
    while (curr) {
      path.push(curr.val);
      if (curr.val === v) {
        return { success: true, message: `Found ${v}! Traversal path: [${path.join(' -> ')}].`, path, found: true, tree: this.toHierarchy() };
      }
      curr = v < curr.val ? curr.left : curr.right;
    }
    return { success: false, message: `${v} is not found in BST. Inspected path: [${path.join(' -> ')}].`, path, found: false, tree: this.toHierarchy() };
  }

  delete(val) {
    const v = Number(val);
    let deleted = false;
    let explanation = '';

    const minVal = (node) => {
      let curr = node;
      while (curr.left) curr = curr.left;
      return curr.val;
    };

    const deleteNode = (node, key) => {
      if (!node) return null;
      if (key < node.val) {
        node.left = deleteNode(node.left, key);
      } else if (key > node.val) {
        node.right = deleteNode(node.right, key);
      } else {
        deleted = true;
        // Node with only one child or no child
        if (!node.left) {
          if (!explanation) explanation = `Node ${key} had at most 1 child; replaced with right subtree.`;
          return node.right;
        } else if (!node.right) {
          if (!explanation) explanation = `Node ${key} had at most 1 child; replaced with left subtree.`;
          return node.left;
        }
        // Node with two children: Get inorder successor
        const succ = minVal(node.right);
        explanation = `Node ${key} has 2 children; replaced with inorder successor (${succ}) from right subtree.`;
        node.val = succ;
        node.right = deleteNode(node.right, succ);
      }
      return node;
    };

    this.root = deleteNode(this.root, v);
    if (!deleted) return { success: false, message: `Cannot delete ${v}: element not found in BST.` };
    return { success: true, message: explanation || `Deleted ${v} from BST.`, tree: this.toHierarchy() };
  }

  inorder() {
    const res = [];
    const traverse = (node) => {
      if (!node) return;
      traverse(node.left);
      res.push(node.val);
      traverse(node.right);
    };
    traverse(this.root);
    return res;
  }

  preorder() {
    const res = [];
    const traverse = (node) => {
      if (!node) return;
      res.push(node.val);
      traverse(node.left);
      traverse(node.right);
    };
    traverse(this.root);
    return res;
  }

  postorder() {
    const res = [];
    const traverse = (node) => {
      if (!node) return;
      traverse(node.left);
      traverse(node.right);
      res.push(node.val);
    };
    traverse(this.root);
    return res;
  }

  levelOrder() {
    const res = [];
    if (!this.root) return res;
    const q = [this.root];
    while (q.length) {
      const node = q.shift();
      res.push(node.val);
      if (node.left) q.push(node.left);
      if (node.right) q.push(node.right);
    }
    return res;
  }

  findMin() {
    if (!this.root) return null;
    let curr = this.root;
    while (curr.left) curr = curr.left;
    return curr.val;
  }

  findMax() {
    if (!this.root) return null;
    let curr = this.root;
    while (curr.right) curr = curr.right;
    return curr.val;
  }

  toHierarchy() {
    const serialize = (node) => {
      if (!node) return null;
      return {
        val: node.val,
        left: serialize(node.left),
        right: serialize(node.right)
      };
    };
    return serialize(this.root);
  }
}

// ==========================================
// 6. AVL TREE (Self-Balancing with Rotations)
// ==========================================
class AVLNode {
  constructor(val) {
    this.val = Number(val);
    this.height = 1;
    this.left = null;
    this.right = null;
  }
}

export class AVLTreeLab {
  constructor(initial = [30, 20, 40, 10, 25]) {
    this.root = null;
    initial.forEach(v => this.insert(v));
  }

  getHeight(node) {
    return node ? node.height : 0;
  }

  getBalance(node) {
    return node ? this.getHeight(node.left) - this.getHeight(node.right) : 0;
  }

  rotateRight(y) {
    const x = y.left;
    const T2 = x.right;
    x.right = y;
    y.left = T2;
    y.height = Math.max(this.getHeight(y.left), this.getHeight(y.right)) + 1;
    x.height = Math.max(this.getHeight(x.left), this.getHeight(x.right)) + 1;
    return x;
  }

  rotateLeft(x) {
    const y = x.right;
    const T2 = y.left;
    y.left = x;
    x.right = T2;
    x.height = Math.max(this.getHeight(x.left), this.getHeight(x.right)) + 1;
    y.height = Math.max(this.getHeight(y.left), this.getHeight(y.right)) + 1;
    return y;
  }

  insert(val) {
    const v = Number(val);
    let rotationPerformed = null;

    const insertNode = (node) => {
      if (!node) return new AVLNode(v);
      if (v < node.val) node.left = insertNode(node.left);
      else if (v > node.val) node.right = insertNode(node.right);
      else return node; // No duplicates in standard AVL

      node.height = 1 + Math.max(this.getHeight(node.left), this.getHeight(node.right));
      const balance = this.getBalance(node);

      // LL Case
      if (balance > 1 && v < node.left.val) {
        rotationPerformed = 'LL (Right Rotation)';
        return this.rotateRight(node);
      }
      // RR Case
      if (balance < -1 && v > node.right.val) {
        rotationPerformed = 'RR (Left Rotation)';
        return this.rotateLeft(node);
      }
      // LR Case
      if (balance > 1 && v > node.left.val) {
        rotationPerformed = 'LR (Left-Right Double Rotation)';
        node.left = this.rotateLeft(node.left);
        return this.rotateRight(node);
      }
      // RL Case
      if (balance < -1 && v < node.right.val) {
        rotationPerformed = 'RL (Right-Left Double Rotation)';
        node.right = this.rotateRight(node.right);
        return this.rotateLeft(node);
      }
      return node;
    };

    this.root = insertNode(this.root);
    const msg = rotationPerformed
      ? `Inserted ${v}. Imbalance restored via ${rotationPerformed}.`
      : `Inserted ${v}. Tree balance factors remain in range [-1, 1].`;
    return { success: true, message: msg, tree: this.toHierarchy() };
  }

  toHierarchy() {
    const serialize = (node) => {
      if (!node) return null;
      return {
        val: node.val,
        height: node.height,
        balance: this.getBalance(node),
        left: serialize(node.left),
        right: serialize(node.right)
      };
    };
    return serialize(this.root);
  }
}

// ==========================================
// 7. HEAP (Min-Heap and Max-Heap)
// ==========================================
export class HeapLab {
  constructor(type = 'max', initial = [50, 30, 20, 15, 10, 8, 16]) {
    this.type = type; // 'min' or 'max'
    this.heap = [];
    initial.forEach(v => this.insert(v));
  }

  compare(a, b) {
    return this.type === 'max' ? a > b : a < b;
  }

  insert(val) {
    const v = Number(val);
    this.heap.push(v);
    let i = this.heap.length - 1;
    // Heapify Up
    while (i > 0) {
      const parent = Math.floor((i - 1) / 2);
      if (this.compare(this.heap[i], this.heap[parent])) {
        const temp = this.heap[i];
        this.heap[i] = this.heap[parent];
        this.heap[parent] = temp;
        i = parent;
      } else {
        break;
      }
    }
    return {
      success: true,
      message: `Inserted ${v} into ${this.type.toUpperCase()}-Heap and restored heap invariant via upward bubble.`,
      heap: [...this.heap]
    };
  }

  extract() {
    if (this.heap.length === 0) return { success: false, message: 'Heap is empty.' };
    const root = this.heap[0];
    const last = this.heap.pop();
    if (this.heap.length > 0) {
      this.heap[0] = last;
      this.heapifyDown(0);
    }
    return {
      success: true,
      message: `Extracted ${this.type === 'max' ? 'maximum' : 'minimum'} element: ${root}. Restored heap via downward sift.`,
      extracted: root,
      heap: [...this.heap]
    };
  }

  peek() {
    if (this.heap.length === 0) return { success: false, message: 'Heap is empty.' };
    return { success: true, message: `Peak element is ${this.heap[0]}.`, heap: [...this.heap] };
  }

  heapifyDown(i) {
    const n = this.heap.length;
    let extreme = i;
    const left = 2 * i + 1;
    const right = 2 * i + 2;

    if (left < n && this.compare(this.heap[left], this.heap[extreme])) extreme = left;
    if (right < n && this.compare(this.heap[right], this.heap[extreme])) extreme = right;

    if (extreme !== i) {
      const temp = this.heap[i];
      this.heap[i] = this.heap[extreme];
      this.heap[extreme] = temp;
      this.heapifyDown(extreme);
    }
  }
}

// ==========================================
// 8. HASH TABLE (Chaining & Open Addressing)
// ==========================================
export class HashTableLab {
  constructor(size = 7, strategy = 'chaining') {
    this.size = size;
    this.strategy = strategy; // 'chaining', 'linear', 'quadratic', 'double'
    this.table = new Array(size).fill(null);
    if (strategy === 'chaining') {
      this.table = Array.from({ length: size }, () => []);
    }
  }

  hash(key) {
    return Math.abs(Number(key)) % this.size;
  }

  hash2(key) {
    // Auxiliary hash for double hashing (must be coprime with size)
    return 1 + (Math.abs(Number(key)) % (this.size - 1));
  }

  insert(key) {
    const k = Number(key);
    const h = this.hash(k);

    if (this.strategy === 'chaining') {
      this.table[h].push(k);
      return { success: true, message: `Inserted key ${k} into bucket ${h} (chain length: ${this.table[h].length}).`, table: JSON.parse(JSON.stringify(this.table)) };
    }

    // Open addressing strategies
    for (let i = 0; i < this.size; i++) {
      let idx;
      if (this.strategy === 'linear') idx = (h + i) % this.size;
      else if (this.strategy === 'quadratic') idx = (h + i * i) % this.size;
      else idx = (h + i * this.hash2(k)) % this.size;

      if (this.table[idx] === null || this.table[idx] === 'DELETED') {
        this.table[idx] = k;
        const collisionInfo = i > 0 ? ` Resolved ${i} collision(s).` : '';
        return { success: true, message: `Inserted ${k} at bucket ${idx}.${collisionInfo}`, table: [...this.table] };
      }
    }
    return { success: false, message: `Hash Table is full: could not insert ${k}.` };
  }

  search(key) {
    const k = Number(key);
    const h = this.hash(k);

    if (this.strategy === 'chaining') {
      const bucket = this.table[h];
      const found = bucket.includes(k);
      return {
        success: found,
        message: found ? `Found ${k} in bucket ${h} chain.` : `Key ${k} not found in bucket ${h}.`,
        table: JSON.parse(JSON.stringify(this.table))
      };
    }

    for (let i = 0; i < this.size; i++) {
      let idx;
      if (this.strategy === 'linear') idx = (h + i) % this.size;
      else if (this.strategy === 'quadratic') idx = (h + i * i) % this.size;
      else idx = (h + i * this.hash2(k)) % this.size;

      if (this.table[idx] === k) {
        return { success: true, message: `Found key ${k} at bucket ${idx} after ${i} probes.`, table: [...this.table] };
      }
      if (this.table[idx] === null) break;
    }
    return { success: false, message: `Key ${k} is not present in hash table.` };
  }

  delete(key) {
    const k = Number(key);
    const h = this.hash(k);

    if (this.strategy === 'chaining') {
      const bucket = this.table[h];
      const idx = bucket.indexOf(k);
      if (idx !== -1) {
        bucket.splice(idx, 1);
        return { success: true, message: `Deleted ${k} from bucket ${h}.`, table: JSON.parse(JSON.stringify(this.table)) };
      }
      return { success: false, message: `Key ${k} not found to delete.` };
    }

    for (let i = 0; i < this.size; i++) {
      let idx;
      if (this.strategy === 'linear') idx = (h + i) % this.size;
      else if (this.strategy === 'quadratic') idx = (h + i * i) % this.size;
      else idx = (h + i * this.hash2(k)) % this.size;

      if (this.table[idx] === k) {
        this.table[idx] = 'DELETED';
        return { success: true, message: `Deleted key ${k} at bucket ${idx}. Marked as tombstone (DELETED).`, table: [...this.table] };
      }
      if (this.table[idx] === null) break;
    }
    return { success: false, message: `Key ${k} not found to delete.` };
  }
}
