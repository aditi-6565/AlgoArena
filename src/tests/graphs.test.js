// Automated tests for Graph Laboratory Algorithms
import { describe, it, expect } from 'vitest';
import { generateGraphTrace } from '../algorithms/graphs/graphTraces.js';
import { SAMPLE_GRAPHS } from '../data/defaultInputs.js';

describe('Graph Algorithms Trace Tests', () => {
  it('BFS visits all connected vertices in FIFO order', () => {
    const steps = generateGraphTrace(SAMPLE_GRAPHS.simple, 'BFS', 'A');
    expect(steps.length).toBeGreaterThan(0);
    const finalStep = steps[steps.length - 1];
    expect(finalStep.visited.sort()).toEqual(['A', 'B', 'C', 'D', 'E', 'F'].sort());
  });

  it('DFS explores graph to completion', () => {
    const steps = generateGraphTrace(SAMPLE_GRAPHS.simple, 'DFS', 'A');
    const finalStep = steps[steps.length - 1];
    expect(finalStep.visited.sort()).toEqual(['A', 'B', 'C', 'D', 'E', 'F'].sort());
  });

  it('Dijkstra rejects negative edge weights with error message', () => {
    const steps = generateGraphTrace(SAMPLE_GRAPHS.negativeWeights, 'Dijkstra', 'S');
    expect(steps[0].kind).toBe('error');
    expect(steps[0].line).toContain('negative edge weights');
  });

  it('Dijkstra computes correct distances on non-negative graph', () => {
    const steps = generateGraphTrace(SAMPLE_GRAPHS.simple, 'Dijkstra', 'A');
    const finalStep = steps[steps.length - 1];
    expect(finalStep.distances['A']).toBe(0);
    expect(finalStep.distances['B']).toBe(4);
    expect(finalStep.distances['C']).toBe(2);
  });

  it('Bellman-Ford accurately detects negative weight cycles', () => {
    const negCycleGraph = {
      directed: true,
      vertices: ['1', '2', '3'],
      edges: [
        { from: '1', to: '2', weight: 1 },
        { from: '2', to: '3', weight: -3 },
        { from: '3', to: '1', weight: -1 }
      ]
    };
    const steps = generateGraphTrace(negCycleGraph, 'Bellman-Ford', '1');
    const cycleStep = steps.find(s => s.kind === 'cycle');
    expect(cycleStep).toBeDefined();
    expect(cycleStep.line).toContain('NEGATIVE WEIGHT CYCLE DETECTED');
  });

  it('Prim and Kruskal build correct Minimum Spanning Tree', () => {
    const primSteps = generateGraphTrace(SAMPLE_GRAPHS.simple, 'Prim', 'A');
    const finalPrim = primSteps[primSteps.length - 1];
    expect(finalPrim.mstEdges.length).toBe(5); // 6 vertices -> 5 edges in MST

    const kruskalSteps = generateGraphTrace(SAMPLE_GRAPHS.simple, 'Kruskal');
    const finalKruskal = kruskalSteps[kruskalSteps.length - 1];
    expect(finalKruskal.mstEdges.length).toBe(5);
  });

  it('Topological Sort correctly orders DAG and rejects cycles', () => {
    const steps = generateGraphTrace(SAMPLE_GRAPHS.dag, 'Topological Sort', '5');
    const finalStep = steps[steps.length - 1];
    expect(finalStep.visited.length).toBe(6);

    const cyclicGraph = {
      directed: true,
      vertices: ['A', 'B'],
      edges: [{ from: 'A', to: 'B' }, { from: 'B', to: 'A' }]
    };
    const cycleSteps = generateGraphTrace(cyclicGraph, 'Topological Sort', 'A');
    expect(cycleSteps[cycleSteps.length - 1].kind).toBe('cycle');
  });

  it('Bipartite Graph Check verifies 2-colorability', () => {
    const bpSteps = generateGraphTrace(SAMPLE_GRAPHS.bipartiteSample, 'Bipartite Graph Check');
    expect(bpSteps[bpSteps.length - 1].line).toContain('bipartite');

    const oddCycle = {
      directed: false,
      vertices: ['A', 'B', 'C'],
      edges: [
        { from: 'A', to: 'B' },
        { from: 'B', to: 'C' },
        { from: 'C', to: 'A' }
      ]
    };
    const oddSteps = generateGraphTrace(oddCycle, 'Bipartite Graph Check');
    expect(oddSteps.some(s => s.kind === 'cycle')).toBe(true);
  });

  it('A* Search finds optimal path using heuristic', () => {
    const steps = generateGraphTrace(SAMPLE_GRAPHS.simple, 'A* Search', 'A', 'F');
    const goalStep = steps.find(s => s.kind === 'done' && s.line.includes('GOAL REACHED'));
    expect(goalStep).toBeDefined();
  });
});
