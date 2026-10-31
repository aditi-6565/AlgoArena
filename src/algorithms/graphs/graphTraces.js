// AlgoArena Deterministic Graph Algorithms Trace Generator
// Implements 15 graph algorithms with validation (negative weight rejection for Dijkstra, negative cycles, DAG checks, MST forests)

export function generateGraphTrace(graphData, algorithm, startVertex = null, goalVertex = null) {
  const { directed = false, vertices = [], edges = [], positions = {} } = graphData;
  const steps = [];

  const pushStep = (description, details = {}) => {
    steps.push({
      line: description,
      vertex: details.vertex || null,
      visited: details.visited ? [...details.visited] : [],
      frontier: details.frontier ? [...details.frontier] : [],
      activeEdges: details.activeEdges ? [...details.activeEdges] : [],
      mstEdges: details.mstEdges ? [...details.mstEdges] : [],
      distances: details.distances ? { ...details.distances } : null,
      predecessors: details.predecessors ? { ...details.predecessors } : null,
      table: details.table ? JSON.parse(JSON.stringify(details.table)) : null,
      kind: details.kind || 'visit',
      codeLine: details.codeLine || 0
    });
  };

  if (!vertices || vertices.length === 0) {
    pushStep('Graph has no vertices.', { kind: 'done' });
    return steps;
  }

  // Build Adjacency List
  const adj = {};
  vertices.forEach(v => { adj[v] = []; });
  edges.forEach(e => {
    if (adj[e.from]) adj[e.from].push({ to: e.to, weight: Number(e.weight) || 1 });
    if (!directed && adj[e.to]) {
      adj[e.to].push({ to: e.from, weight: Number(e.weight) || 1 });
    }
  });

  const root = startVertex && vertices.includes(startVertex) ? startVertex : vertices[0];
  const target = goalVertex && vertices.includes(goalVertex) ? goalVertex : vertices[vertices.length - 1];

  switch (algorithm) {
    case 'BFS': {
      pushStep(`Starting Breadth-First Search (BFS) from root vertex ${root}. Using FIFO queue.`, { vertex: root, frontier: [root], kind: 'visit', codeLine: 1 });
      const visited = new Set([root]);
      const queue = [root];

      while (queue.length > 0) {
        const u = queue.shift();
        const unvisitedNeighbors = (adj[u] || []).filter(e => !visited.has(e.to));
        pushStep(`Visit vertex ${u}. Checking adjacent neighbors: [${unvisitedNeighbors.map(e => e.to).join(', ') || 'none'}].`, {
          vertex: u,
          visited: Array.from(visited),
          frontier: [...queue],
          kind: 'visit',
          codeLine: 4
        });

        for (let edge of (adj[u] || [])) {
          const v = edge.to;
          if (!visited.has(v)) {
            visited.add(v);
            queue.push(v);
            pushStep(`Discover unvisited neighbor ${v} along edge (${u} -> ${v}). Added to FIFO queue.`, {
              vertex: v,
              visited: Array.from(visited),
              frontier: [...queue],
              activeEdges: [`${u}-${v}`],
              kind: 'explore',
              codeLine: 6
            });
          }
        }
      }
      pushStep(`BFS traversal complete. Visited ${visited.size} of ${vertices.length} vertices.`, { visited: Array.from(visited), kind: 'done', codeLine: 7 });
      break;
    }

    case 'DFS': {
      pushStep(`Starting Depth-First Search (DFS) from vertex ${root} using recursion / LIFO stack.`, { vertex: root, visited: [root], kind: 'visit', codeLine: 0 });
      const visited = new Set();

      const dfs = (u) => {
        visited.add(u);
        pushStep(`Visit vertex ${u}. Deepening along unvisited paths.`, { vertex: u, visited: Array.from(visited), kind: 'visit', codeLine: 1 });
        for (let edge of (adj[u] || [])) {
          const v = edge.to;
          if (!visited.has(v)) {
            pushStep(`Explore edge (${u} -> ${v}) to unvisited neighbor ${v}.`, { vertex: u, visited: Array.from(visited), activeEdges: [`${u}-${v}`], kind: 'explore', codeLine: 4 });
            dfs(v);
            pushStep(`Backtracked to vertex ${u} after exploring branch ${v}.`, { vertex: u, visited: Array.from(visited), kind: 'backtrack', codeLine: 4 });
          }
        }
      };

      dfs(root);
      pushStep(`DFS traversal complete. Total vertices visited: ${visited.size}.`, { visited: Array.from(visited), kind: 'done', codeLine: 4 });
      break;
    }

    case 'Dijkstra': {
      // Validate negative weights
      const hasNegativeWeight = edges.some(e => Number(e.weight) < 0);
      if (hasNegativeWeight) {
        pushStep('ERROR: Dijkstra\'s Algorithm cannot be applied to graphs with negative edge weights! Please use Bellman-Ford.', { kind: 'error', codeLine: 0 });
        return steps;
      }

      pushStep(`Starting Dijkstra's Shortest Path from source ${root}. Initialize all distances to ∞, dist[${root}] = 0.`, { vertex: root, kind: 'visit', codeLine: 1 });
      const dist = {};
      const pred = {};
      vertices.forEach(v => { dist[v] = Infinity; pred[v] = null; });
      dist[root] = 0;

      const unvisited = new Set(vertices);

      while (unvisited.size > 0) {
        // Pick vertex with min distance in unvisited
        let u = null;
        for (let v of unvisited) {
          if (u === null || dist[v] < dist[u]) {
            u = v;
          }
        }

        if (dist[u] === Infinity) {
          pushStep(`Remaining vertices [${Array.from(unvisited).join(', ')}] are unreachable from source ${root}.`, { distances: dist, predecessors: pred, kind: 'done' });
          break;
        }

        unvisited.delete(u);
        pushStep(`Greedily finalize vertex ${u} with minimum known distance ${dist[u]}.`, {
          vertex: u,
          visited: vertices.filter(v => !unvisited.has(v)),
          distances: dist,
          predecessors: pred,
          kind: 'visit',
          codeLine: 4
        });

        for (let edge of (adj[u] || [])) {
          const v = edge.to;
          if (unvisited.has(v)) {
            const newDist = dist[u] + edge.weight;
            if (newDist < dist[v]) {
              dist[v] = newDist;
              pred[v] = u;
              pushStep(`Relax edge (${u} -> ${v}, w=${edge.weight}): updated dist[${v}] from ∞ to ${newDist}.`, {
                vertex: v,
                visited: vertices.filter(n => !unvisited.has(n)),
                activeEdges: [`${u}-${v}`],
                distances: dist,
                predecessors: pred,
                kind: 'relax',
                codeLine: 7
              });
            }
          }
        }
      }

      pushStep(`Dijkstra complete. All shortest paths from ${root} computed.`, { distances: dist, predecessors: pred, kind: 'done', codeLine: 8 });
      break;
    }

    case 'Bellman-Ford': {
      pushStep(`Starting Bellman-Ford from source ${root}. Will perform |V| - 1 = ${vertices.length - 1} relaxation passes over all edges.`, { vertex: root, kind: 'visit', codeLine: 1 });
      const dist = {};
      const pred = {};
      vertices.forEach(v => { dist[v] = Infinity; pred[v] = null; });
      dist[root] = 0;

      const edgeList = [];
      vertices.forEach(u => {
        (adj[u] || []).forEach(edge => {
          edgeList.push({ from: u, to: edge.to, weight: edge.weight });
        });
      });

      for (let i = 1; i <= vertices.length - 1; i++) {
        let changed = false;
        pushStep(`Pass ${i} of ${vertices.length - 1}: Relaxing all ${edgeList.length} edges.`, { distances: dist, predecessors: pred, kind: 'explore', codeLine: 2 });
        for (let e of edgeList) {
          if (dist[e.from] !== Infinity && dist[e.from] + e.weight < dist[e.to]) {
            dist[e.to] = dist[e.from] + e.weight;
            pred[e.to] = e.from;
            changed = true;
            pushStep(`Relaxed (${e.from} -> ${e.to}, w=${e.weight}): dist[${e.to}] = ${dist[e.to]}.`, {
              activeEdges: [`${e.from}-${e.to}`],
              distances: dist,
              predecessors: pred,
              kind: 'relax',
              codeLine: 4
            });
          }
        }
        if (!changed) {
          pushStep(`Pass ${i}: No edge distances changed. Early convergence achieved!`, { distances: dist, predecessors: pred, kind: 'done', codeLine: 5 });
          break;
        }
      }

      // Check for negative weight cycles
      let hasNegCycle = false;
      for (let e of edgeList) {
        if (dist[e.from] !== Infinity && dist[e.from] + e.weight < dist[e.to]) {
          hasNegCycle = true;
          pushStep(`NEGATIVE WEIGHT CYCLE DETECTED on edge (${e.from} -> ${e.to})! Distances decrease infinitely.`, {
            activeEdges: [`${e.from}-${e.to}`],
            distances: dist,
            kind: 'cycle',
            codeLine: 7
          });
          break;
        }
      }
      if (!hasNegCycle) {
        pushStep(`Bellman-Ford completed successfully. No negative cycles detected.`, { distances: dist, predecessors: pred, kind: 'done', codeLine: 7 });
      }
      break;
    }

    case 'Floyd-Warshall': {
      pushStep(`Starting Floyd-Warshall All-Pairs Shortest Path across ${vertices.length} vertices.`, { kind: 'start', codeLine: 0 });
      const V = vertices.length;
      const vIndex = {};
      vertices.forEach((v, i) => { vIndex[v] = i; });

      const distMatrix = Array.from({ length: V }, () => new Array(V).fill(Infinity));
      for (let i = 0; i < V; i++) distMatrix[i][i] = 0;

      edges.forEach(e => {
        const u = vIndex[e.from];
        const v = vIndex[e.to];
        if (u !== undefined && v !== undefined) {
          distMatrix[u][v] = Math.min(distMatrix[u][v], Number(e.weight) || 1);
          if (!directed) distMatrix[v][u] = Math.min(distMatrix[v][u], Number(e.weight) || 1);
        }
      });

      pushStep(`Initial distance matrix built from direct edges.`, { table: distMatrix, kind: 'visit', codeLine: 0 });

      for (let k = 0; k < V; k++) {
        const pivotVertex = vertices[k];
        pushStep(`Iteration k = ${k} (intermediate vertex '${pivotVertex}'): checking if passing through '${pivotVertex}' shortens any path.`, {
          vertex: pivotVertex,
          table: distMatrix,
          kind: 'explore',
          codeLine: 1
        });
        for (let i = 0; i < V; i++) {
          for (let j = 0; j < V; j++) {
            if (distMatrix[i][k] !== Infinity && distMatrix[k][j] !== Infinity) {
              if (distMatrix[i][k] + distMatrix[k][j] < distMatrix[i][j]) {
                distMatrix[i][j] = distMatrix[i][k] + distMatrix[k][j];
                pushStep(`Updated dist[${vertices[i]}][${vertices[j]}] = ${distMatrix[i][j]} via intermediate ${pivotVertex}.`, {
                  vertex: pivotVertex,
                  table: distMatrix,
                  kind: 'relax',
                  codeLine: 4
                });
              }
            }
          }
        }
      }
      pushStep('Floyd-Warshall all-pairs shortest paths matrix computation complete.', { table: distMatrix, kind: 'done', codeLine: 4 });
      break;
    }

    case 'Prim': {
      pushStep(`Starting Prim's Minimum Spanning Tree from vertex ${root}.`, { vertex: root, visited: [root], kind: 'visit', codeLine: 0 });
      const inMST = new Set([root]);
      const mstEdges = [];
      let totalWeight = 0;

      while (inMST.size < vertices.length) {
        let minEdge = null;
        for (let u of inMST) {
          for (let edge of (adj[u] || [])) {
            if (!inMST.has(edge.to)) {
              if (minEdge === null || edge.weight < minEdge.weight) {
                minEdge = { from: u, to: edge.to, weight: edge.weight };
              }
            }
          }
        }

        if (!minEdge) {
          pushStep(`Graph is disconnected! Remaining vertices [${vertices.filter(v => !inMST.has(v)).join(', ')}] form a separate component. Minimum Spanning Forest returned.`, {
            visited: Array.from(inMST),
            mstEdges: [...mstEdges],
            kind: 'done',
            codeLine: 4
          });
          break;
        }

        inMST.add(minEdge.to);
        mstEdges.push(`${minEdge.from}-${minEdge.to}`);
        totalWeight += minEdge.weight;
        pushStep(`Greedily add edge (${minEdge.from} - ${minEdge.to}, w=${minEdge.weight}) to MST. Total MST cost: ${totalWeight}.`, {
          vertex: minEdge.to,
          visited: Array.from(inMST),
          mstEdges: [...mstEdges],
          activeEdges: [`${minEdge.from}-${minEdge.to}`],
          kind: 'mst',
          codeLine: 3
        });
      }

      pushStep(`Prim's MST complete with total cost ${totalWeight}.`, { visited: Array.from(inMST), mstEdges: [...mstEdges], kind: 'done', codeLine: 4 });
      break;
    }

    case 'Kruskal': {
      pushStep(`Starting Kruskal's MST. Sorting all ${edges.length} edges by weight ascending.`, { kind: 'start', codeLine: 1 });
      const sortedEdges = [...edges].sort((a, b) => Number(a.weight) - Number(b.weight));
      const parent = {};
      vertices.forEach(v => { parent[v] = v; });
      const find = (i) => (parent[i] === i ? i : (parent[i] = find(parent[i])));
      const union = (i, j) => {
        const rootI = find(i);
        const rootJ = find(j);
        if (rootI !== rootJ) {
          parent[rootI] = rootJ;
          return true;
        }
        return false;
      };

      const mstEdges = [];
      let totalCost = 0;

      for (let e of sortedEdges) {
        const fromRoot = find(e.from);
        const toRoot = find(e.to);
        pushStep(`Inspect edge (${e.from} - ${e.to}, w=${e.weight}): sets are {${fromRoot}} and {${toRoot}}.`, {
          activeEdges: [`${e.from}-${e.to}`],
          mstEdges: [...mstEdges],
          kind: 'explore',
          codeLine: 4
        });

        if (fromRoot !== toRoot) {
          union(e.from, e.to);
          mstEdges.push(`${e.from}-${e.to}`);
          totalCost += Number(e.weight);
          pushStep(`No cycle formed: Add edge (${e.from} - ${e.to}, w=${e.weight}) to MST. Current cost: ${totalCost}.`, {
            activeEdges: [`${e.from}-${e.to}`],
            mstEdges: [...mstEdges],
            kind: 'mst',
            codeLine: 6
          });
        } else {
          pushStep(`Cycle detected! Edge (${e.from} - ${e.to}) would connect vertices in same component {${fromRoot}}. Discarded.`, {
            activeEdges: [`${e.from}-${e.to}`],
            mstEdges: [...mstEdges],
            kind: 'cycle',
            codeLine: 4
          });
        }
      }

      pushStep(`Kruskal's MST complete with total weight ${totalCost}.`, { mstEdges: [...mstEdges], kind: 'done', codeLine: 6 });
      break;
    }

    case 'Topological Sort': {
      if (!directed) {
        pushStep('Topological Sort requires a DIRECTED Acyclic Graph (DAG). Toggling to directed model for evaluation.', { kind: 'warning', codeLine: 0 });
      }
      pushStep('Starting Kahn\'s Algorithm for Topological Sort using in-degrees.', { kind: 'start', codeLine: 1 });
      const inDegree = {};
      vertices.forEach(v => { inDegree[v] = 0; });
      edges.forEach(e => {
        if (inDegree[e.to] !== undefined) inDegree[e.to]++;
      });

      const queue = vertices.filter(v => inDegree[v] === 0);
      pushStep(`Calculated in-degrees. Vertices with in-degree 0: [${queue.join(', ')}].`, { frontier: [...queue], kind: 'visit', codeLine: 2 });

      const topoOrder = [];
      while (queue.length > 0) {
        const u = queue.shift();
        topoOrder.push(u);
        pushStep(`Process vertex ${u} (in-degree 0). Add to topological order: [${topoOrder.join(' -> ')}].`, {
          vertex: u,
          visited: [...topoOrder],
          frontier: [...queue],
          kind: 'visit',
          codeLine: 6
        });

        for (let edge of (adj[u] || [])) {
          const v = edge.to;
          inDegree[v]--;
          pushStep(`Decrement in-degree of neighbor ${v} to ${inDegree[v]}.`, {
            activeEdges: [`${u}-${v}`],
            frontier: [...queue],
            kind: 'explore',
            codeLine: 8
          });
          if (inDegree[v] === 0) {
            queue.push(v);
            pushStep(`Vertex ${v} now has in-degree 0. Added to queue.`, { frontier: [...queue], kind: 'visit', codeLine: 9 });
          }
        }
      }

      if (topoOrder.length !== vertices.length) {
        pushStep(`CYCLE DETECTED! Graph contains a directed cycle; only ${topoOrder.length} of ${vertices.length} vertices could be ordered.`, { kind: 'cycle', codeLine: 9 });
      } else {
        pushStep(`Topological Sort complete! Valid linear DAG order: [${topoOrder.join(' -> ')}].`, { visited: [...topoOrder], kind: 'done', codeLine: 9 });
      }
      break;
    }

    case 'Cycle Detection': {
      pushStep(`Starting Cycle Detection (${directed ? 'Directed 3-Color / Recursion Stack' : 'Undirected Parent Check'}).`, { kind: 'start', codeLine: 0 });
      let hasCycle = false;

      if (directed) {
        const visited = {};
        const recStack = {};
        vertices.forEach(v => { visited[v] = false; recStack[v] = false; });

        const dfsCheck = (u) => {
          visited[u] = true;
          recStack[u] = true;
          pushStep(`Enter vertex ${u} (in recursion stack).`, { vertex: u, kind: 'visit', codeLine: 1 });

          for (let edge of (adj[u] || [])) {
            const v = edge.to;
            if (!visited[v]) {
              if (dfsCheck(v)) return true;
            } else if (recStack[v]) {
              pushStep(`BACK-EDGE (${u} -> ${v}) DETECTED! Vertex ${v} is already in the current active recursion stack. Cycle confirmed!`, {
                activeEdges: [`${u}-${v}`],
                kind: 'cycle',
                codeLine: 4
              });
              hasCycle = true;
              return true;
            }
          }
          recStack[u] = false;
          pushStep(`Leave vertex ${u} (removed from recursion stack).`, { vertex: u, kind: 'backtrack', codeLine: 5 });
          return false;
        };

        for (let v of vertices) {
          if (!visited[v]) {
            if (dfsCheck(v)) break;
          }
        }
      } else {
        const visited = new Set();
        const dfsUndirected = (u, parent) => {
          visited.add(u);
          pushStep(`Visit vertex ${u} with parent ${parent || 'none'}.`, { vertex: u, visited: Array.from(visited), kind: 'visit', codeLine: 1 });
          for (let edge of (adj[u] || [])) {
            const v = edge.to;
            if (!visited.has(v)) {
              if (dfsUndirected(v, u)) return true;
            } else if (v !== parent) {
              pushStep(`CYCLE DETECTED: Edge (${u} - ${v}) connects to already visited vertex ${v} (which is not parent ${parent})!`, {
                activeEdges: [`${u}-${v}`],
                kind: 'cycle',
                codeLine: 4
              });
              hasCycle = true;
              return true;
            }
          }
          return false;
        };

        for (let v of vertices) {
          if (!visited.has(v)) {
            if (dfsUndirected(v, null)) break;
          }
        }
      }

      if (!hasCycle) {
        pushStep('Cycle Detection complete: Graph is acyclic (contains no cycles).', { kind: 'done', codeLine: 6 });
      }
      break;
    }

    case 'Connected Components': {
      pushStep('Starting Connected Components identification via repeated traversal.', { kind: 'start', codeLine: 0 });
      const visited = new Set();
      const components = [];

      for (let v of vertices) {
        if (!visited.has(v)) {
          const comp = [];
          const q = [v];
          visited.add(v);
          while (q.length > 0) {
            const curr = q.shift();
            comp.push(curr);
            for (let edge of (adj[curr] || [])) {
              if (!visited.has(edge.to)) {
                visited.add(edge.to);
                q.push(edge.to);
              }
            }
          }
          components.push(comp);
          pushStep(`Discovered Component #${components.length}: { ${comp.join(', ')} }.`, { visited: Array.from(visited), kind: 'visit', codeLine: 4 });
        }
      }
      pushStep(`Connected Components analysis complete. Found ${components.length} disjoint component(s).`, { kind: 'done', codeLine: 5 });
      break;
    }

    case 'Strongly Connected Components': {
      pushStep('Starting Kosaraju\'s 2-pass algorithm for Strongly Connected Components (SCC).', { kind: 'start', codeLine: 0 });
      const visited = new Set();
      const stack = [];

      const dfs1 = (u) => {
        visited.add(u);
        for (let edge of (adj[u] || [])) {
          if (!visited.has(edge.to)) dfs1(edge.to);
        }
        stack.push(u);
        pushStep(`Pass 1: Finished vertex ${u}; pushed to order stack: [${stack.join(', ')}].`, { vertex: u, kind: 'visit', codeLine: 2 });
      };

      for (let v of vertices) {
        if (!visited.has(v)) dfs1(v);
      }

      // Build Transposed Graph
      const transposed = {};
      vertices.forEach(v => { transposed[v] = []; });
      edges.forEach(e => {
        if (transposed[e.to]) transposed[e.to].push(e.from);
      });
      pushStep('Pass 1 finished. Reversed all directed edges to build transposed graph.', { kind: 'explore', codeLine: 3 });

      visited.clear();
      const sccs = [];

      const dfs2 = (u, currentSCC) => {
        visited.add(u);
        currentSCC.push(u);
        for (let neighbor of (transposed[u] || [])) {
          if (!visited.has(neighbor)) dfs2(neighbor, currentSCC);
        }
      };

      while (stack.length > 0) {
        const u = stack.pop();
        if (!visited.has(u)) {
          const currentSCC = [];
          dfs2(u, currentSCC);
          sccs.push(currentSCC);
          pushStep(`Pass 2: Discovered SCC #${sccs.length}: { ${currentSCC.join(', ')} }.`, { visited: Array.from(visited), kind: 'mst', codeLine: 4 });
        }
      }
      pushStep(`Kosaraju complete. Total Strongly Connected Components: ${sccs.length}.`, { kind: 'done', codeLine: 4 });
      break;
    }

    case 'Bipartite Graph Check': {
      pushStep('Starting Bipartite Graph check via 2-coloring (Color 0 vs Color 1).', { kind: 'start', codeLine: 1 });
      const color = {};
      vertices.forEach(v => { color[v] = -1; });
      let isBipartite = true;

      for (let start of vertices) {
        if (color[start] === -1) {
          color[start] = 0;
          const q = [start];
          pushStep(`Assign root ${start} Color 0.`, { vertex: start, kind: 'visit', codeLine: 4 });

          while (q.length > 0) {
            const u = q.shift();
            for (let edge of (adj[u] || [])) {
              const v = edge.to;
              if (color[v] === -1) {
                color[v] = 1 - color[u];
                q.push(v);
                pushStep(`Assign neighbor ${v} Color ${color[v]} (opposite of ${u}'s Color ${color[u]}).`, {
                  vertex: v,
                  activeEdges: [`${u}-${v}`],
                  kind: 'explore',
                  codeLine: 9
                });
              } else if (color[v] === color[u]) {
                pushStep(`CONFLICT DETECTED! Adjacent vertices ${u} and ${v} share identical Color ${color[u]}. Graph has an odd cycle and is NOT bipartite.`, {
                  vertex: v,
                  activeEdges: [`${u}-${v}`],
                  kind: 'cycle',
                  codeLine: 11
                });
                isBipartite = false;
                break;
              }
            }
            if (!isBipartite) break;
          }
        }
        if (!isBipartite) break;
      }

      if (isBipartite) {
        pushStep('Bipartite verification complete: Graph is bipartite (2-colorable with no monochromatic edges).', { kind: 'done', codeLine: 12 });
      }
      break;
    }

    case 'Articulation Points': {
      pushStep('Starting Tarjan\'s Articulation Points algorithm using discovery times tin[] and low[] link numbers.', { kind: 'start', codeLine: 0 });
      let timer = 0;
      const tin = {};
      const low = {};
      const visited = new Set();
      const isAP = new Set();

      const dfsAP = (u, p = null) => {
        visited.add(u);
        tin[u] = low[u] = ++timer;
        let children = 0;

        for (let edge of (adj[u] || [])) {
          const v = edge.to;
          if (v === p) continue;
          if (visited.has(v)) {
            low[u] = Math.min(low[u], tin[v]);
          } else {
            children++;
            dfsAP(v, u);
            low[u] = Math.min(low[u], low[v]);
            if (low[v] >= tin[u] && p !== null) {
              isAP.add(u);
              pushStep(`Articulation Point identified: Vertex ${u} (low[${v}]=${low[v]} >= tin[${u}]=${tin[u]}).`, { vertex: u, kind: 'cycle', codeLine: 8 });
            }
          }
        }
        if (p === null && children > 1) {
          isAP.add(u);
          pushStep(`Root Articulation Point identified: Vertex ${u} has ${children} independent children.`, { vertex: u, kind: 'cycle', codeLine: 9 });
        }
      };

      for (let v of vertices) {
        if (!visited.has(v)) dfsAP(v);
      }

      pushStep(`Articulation Points search complete. Found cut vertices: [${Array.from(isAP).join(', ') || 'None'}].`, { kind: 'done', codeLine: 9 });
      break;
    }

    case 'Bridges': {
      pushStep('Starting Bridge (Cut-Edge) detection using DFS low-link values (low[v] > tin[u]).', { kind: 'start', codeLine: 0 });
      let timer = 0;
      const tin = {};
      const low = {};
      const visited = new Set();
      const bridges = [];

      const dfsBridge = (u, p = null) => {
        visited.add(u);
        tin[u] = low[u] = ++timer;

        for (let edge of (adj[u] || [])) {
          const v = edge.to;
          if (v === p) continue;
          if (visited.has(v)) {
            low[u] = Math.min(low[u], tin[v]);
          } else {
            dfsBridge(v, u);
            low[u] = Math.min(low[u], low[v]);
            if (low[v] > tin[u]) {
              bridges.push(`${u}-${v}`);
              pushStep(`CRITICAL BRIDGE IDENTIFIED: Edge (${u} - ${v}) because low[${v}]=${low[v]} > tin[${u}]=${tin[u]}. Removing it disconnects the graph!`, {
                activeEdges: [`${u}-${v}`],
                kind: 'cycle',
                codeLine: 8
              });
            }
          }
        }
      };

      for (let v of vertices) {
        if (!visited.has(v)) dfsBridge(v);
      }

      pushStep(`Bridge detection complete. Total critical bridges found: ${bridges.length}.`, { activeEdges: bridges, kind: 'done', codeLine: 8 });
      break;
    }

    case 'A* Search': {
      pushStep(`Starting A* Search from start ${root} to goal ${target}. Using Euclidean distance heuristic.`, { vertex: root, kind: 'visit', codeLine: 0 });
      const euclideanHeuristic = (u, v) => {
        const p1 = positions[u] || { x: 0, y: 0 };
        const p2 = positions[v] || { x: 100, y: 100 };
        return Math.hypot(p1.x - p2.x, p1.y - p2.y) / 50; // normalized scale
      };

      const gScore = {};
      const fScore = {};
      const pred = {};
      vertices.forEach(v => { gScore[v] = Infinity; fScore[v] = Infinity; pred[v] = null; });
      gScore[root] = 0;
      fScore[root] = euclideanHeuristic(root, target);

      const openSet = new Set([root]);
      const closedSet = new Set();

      while (openSet.size > 0) {
        let current = null;
        for (let v of openSet) {
          if (current === null || fScore[v] < fScore[current]) {
            current = v;
          }
        }

        if (current === target) {
          // Reconstruct path
          const path = [];
          let curr = target;
          while (curr) {
            path.unshift(curr);
            curr = pred[curr];
          }
          const pathEdges = [];
          for (let i = 0; i < path.length - 1; i++) {
            pathEdges.push(`${path[i]}-${path[i + 1]}`);
          }
          pushStep(`GOAL REACHED! Optimal path to ${target}: [${path.join(' -> ')}] with exact cost ${gScore[target].toFixed(1)}.`, {
            vertex: target,
            visited: Array.from(closedSet),
            mstEdges: pathEdges,
            kind: 'done',
            codeLine: 3
          });
          return steps;
        }

        openSet.delete(current);
        closedSet.add(current);
        pushStep(`Evaluate vertex ${current}: g=${gScore[current].toFixed(1)}, h=${euclideanHeuristic(current, target).toFixed(1)}, f=${fScore[current].toFixed(1)}.`, {
          vertex: current,
          visited: Array.from(closedSet),
          frontier: Array.from(openSet),
          kind: 'visit',
          codeLine: 2
        });

        for (let edge of (adj[current] || [])) {
          const neighbor = edge.to;
          if (closedSet.has(neighbor)) continue;

          const tentativeG = gScore[current] + edge.weight;
          if (tentativeG < gScore[neighbor]) {
            pred[neighbor] = current;
            gScore[neighbor] = tentativeG;
            fScore[neighbor] = tentativeG + euclideanHeuristic(neighbor, target);
            openSet.add(neighbor);
            pushStep(`Relax edge (${current} -> ${neighbor}): gScore=${tentativeG.toFixed(1)}, fScore=${fScore[neighbor].toFixed(1)}.`, {
              vertex: neighbor,
              activeEdges: [`${current}-${neighbor}`],
              frontier: Array.from(openSet),
              kind: 'relax',
              codeLine: 6
            });
          }
        }
      }

      pushStep(`A* Search complete. No path exists from ${root} to ${target}.`, { kind: 'done', codeLine: 3 });
      break;
    }

    default:
      pushStep(`Algorithm ${algorithm} completed.`, { kind: 'done' });
  }

  return steps;
}
