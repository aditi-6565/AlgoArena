// Automated unit tests for Data Structures Laboratory
import { describe, it, expect } from 'vitest';
import {
  ArrayLab,
  StackLab,
  QueueLab,
  CircularQueueLab,
  DequeLab,
  LinkedListLab,
  BSTLab,
  AVLTreeLab,
  HeapLab,
  HashTableLab
} from '../data-structures/dataStructuresEngine.js';

describe('Data Structures Engine Tests', () => {
  describe('ArrayLab', () => {
    it('handles insert, delete, update, access, search, and boundary checks', () => {
      const arr = new ArrayLab([10, 20, 30], 5);
      const res = arr.insert(1, 15);
      expect(res.success).toBe(true);
      expect(arr.elements).toEqual([10, 15, 20, 30]);

      // Access
      expect(arr.access(1).message).toContain('15');
      // Search
      expect(arr.search(20).success).toBe(true);
      expect(arr.search(99).success).toBe(false);

      // Delete
      arr.delete(1);
      expect(arr.elements).toEqual([10, 20, 30]);

      // Capacity overflow check
      arr.insert(0, 1);
      arr.insert(0, 2);
      expect(arr.elements.length).toBe(5);
      const overflow = arr.insert(0, 99);
      expect(overflow.success).toBe(false);
      expect(overflow.message).toContain('Overflow');
    });
  });

  describe('StackLab', () => {
    it('manages LIFO behavior, overflow and underflow', () => {
      const stack = new StackLab(3, []);
      expect(stack.isEmpty()).toBe(true);
      expect(stack.pop().success).toBe(false); // Underflow

      stack.push(10);
      stack.push(20);
      stack.push(30);
      expect(stack.isFull()).toBe(true);

      const overflow = stack.push(40);
      expect(overflow.success).toBe(false);
      expect(overflow.message).toContain('Overflow');

      expect(stack.peek().message).toContain('30');
      const popRes = stack.pop();
      expect(popRes.success).toBe(true);
      expect(stack.items).toEqual([10, 20]);
    });
  });

  describe('QueueLab and CircularQueueLab', () => {
    it('Queue manages FIFO order', () => {
      const q = new QueueLab(3, []);
      q.enqueue(1);
      q.enqueue(2);
      expect(q.dequeue().message).toContain('1');
      expect(q.items).toEqual([2]);
    });

    it('CircularQueue handles wraparound correctly', () => {
      const cq = new CircularQueueLab(3);
      cq.enqueue(10);
      cq.enqueue(20);
      cq.enqueue(30);
      expect(cq.enqueue(40).success).toBe(false); // Full

      // Dequeue 2 items
      cq.dequeue(); // removes 10
      cq.dequeue(); // removes 20

      // Enqueue wraps around to index 0 and 1
      const res = cq.enqueue(50);
      expect(res.success).toBe(true);
      expect(res.rear).toBe(0); // Wrapped around to 0
      expect(cq.buffer[0]).toBe(50);
    });
  });

  describe('DequeLab', () => {
    it('inserts and deletes from front and rear', () => {
      const deque = new DequeLab(5, []);
      deque.insertFront(10);
      deque.insertRear(20);
      deque.insertFront(5);
      expect(deque.items).toEqual([5, 10, 20]);
      deque.deleteRear();
      expect(deque.items).toEqual([5, 10]);
      deque.deleteFront();
      expect(deque.items).toEqual([10]);
    });
  });

  describe('LinkedListLab', () => {
    it('supports insert, delete, reverse on singly linked list', () => {
      const ll = new LinkedListLab('singly', []);
      ll.insertBeginning(20);
      ll.insertBeginning(10);
      ll.insertEnd(30);
      ll.insertAtPosition(1, 15);
      const arr1 = ll.toArray().map(n => n.val);
      expect(arr1).toEqual([10, 15, 20, 30]);

      ll.deleteValue(20);
      expect(ll.toArray().map(n => n.val)).toEqual([10, 15, 30]);

      ll.reverse();
      expect(ll.toArray().map(n => n.val)).toEqual([30, 15, 10]);
    });

    it('supports circular linked list', () => {
      const cll = new LinkedListLab('circular-singly', [1, 2, 3]);
      expect(cll.head.next.next.next.val).toBe(1); // loop back
      cll.insertBeginning(0);
      expect(cll.tail.next.val).toBe(0);
    });
  });

  describe('BSTLab', () => {
    it('performs insert, search, inorder traversal, and 2-child node deletion', () => {
      const bst = new BSTLab([50, 30, 70, 20, 40, 60, 80]);
      expect(bst.inorder()).toEqual([20, 30, 40, 50, 60, 70, 80]);
      expect(bst.search(40).found).toBe(true);
      expect(bst.search(99).found).toBe(false);

      // Delete node with 2 children (30) -> replaced by inorder successor (40)
      const delRes = bst.delete(30);
      expect(delRes.success).toBe(true);
      expect(delRes.message).toContain('inorder successor');
      expect(bst.inorder()).toEqual([20, 40, 50, 60, 70, 80]);
    });
  });

  describe('AVLTreeLab', () => {
    it('maintains balance factors across insertions (triggers rotations)', () => {
      const avl = new AVLTreeLab([]);
      // Inserting 30, 20, 10 triggers LL rotation
      avl.insert(30);
      avl.insert(20);
      const res = avl.insert(10);
      expect(res.message).toContain('LL (Right Rotation)');
      expect(avl.root.val).toBe(20);
      expect(avl.root.left.val).toBe(10);
      expect(avl.root.right.val).toBe(30);
    });
  });

  describe('HeapLab', () => {
    it('preserves Max-Heap and Min-Heap properties', () => {
      const maxHeap = new HeapLab('max', [10, 20, 30, 40, 50]);
      expect(maxHeap.peek().heap[0]).toBe(50);
      const ext = maxHeap.extract();
      expect(ext.extracted).toBe(50);
      expect(maxHeap.heap[0]).toBe(40);

      const minHeap = new HeapLab('min', [50, 40, 30, 20, 10]);
      expect(minHeap.peek().heap[0]).toBe(10);
    });
  });

  describe('HashTableLab', () => {
    it('handles Chaining and Linear Probing collisions properly', () => {
      // Chaining
      const chainTable = new HashTableLab(5, 'chaining');
      chainTable.insert(10); // hash = 0
      chainTable.insert(15); // hash = 0
      expect(chainTable.table[0].length).toBe(2);
      expect(chainTable.search(15).success).toBe(true);

      // Linear Probing
      const openTable = new HashTableLab(5, 'linear');
      openTable.insert(5); // index 0
      openTable.insert(10); // collision -> index 1
      expect(openTable.table[0]).toBe(5);
      expect(openTable.table[1]).toBe(10);
      expect(openTable.search(10).success).toBe(true);
      openTable.delete(5);
      expect(openTable.table[0]).toBe('DELETED');
      expect(openTable.search(10).success).toBe(true); // Can still probe past tombstone
    });
  });
});
