export type GraphStep = {
  type: "visit" | "explore" | "queue" | "finished";
  node: number;
  neighbors?: number[];
  description?: string;
};

// Simple adjacency list for demo: 0 -> [1, 2], 1 -> [3], 2 -> [4], etc.
export const defaultGraph = [
  [1, 2],    // Node 0
  [0, 3, 4], // Node 1
  [0, 5],    // Node 2
  [1],       // Node 3
  [1, 5],    // Node 4
  [2, 4]     // Node 5
];

export function* bfs(graph: number[][], startNode: number): Generator<GraphStep> {
  const visited = new Set<number>();
  const queue = [startNode];
  visited.add(startNode);

  yield { type: "queue", node: startNode, description: `Starting BFS from node ${startNode}` };

  while (queue.length > 0) {
    const node = queue.shift()!;
    yield { type: "visit", node: node, description: `Visiting node ${node}` };

    const neighbors = graph[node] || [];
    yield { type: "explore", node: node, neighbors, description: `Exploring neighbors of ${node}: ${neighbors.join(", ")}` };

    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
        yield { type: "queue", node: neighbor, description: `Queuing unvisited neighbor ${neighbor}` };
      }
    }
    yield { type: "finished", node: node, description: `Finished processing node ${node}` };
  }
}

export function* dfs(graph: number[][], startNode: number): Generator<GraphStep> {
  const visited = new Set<number>();
  const stack = [startNode];

  yield { type: "queue", node: startNode, description: `Starting DFS from node ${startNode}` };

  while (stack.length > 0) {
    const node = stack.pop()!;

    if (!visited.has(node)) {
      visited.add(node);
      yield { type: "visit", node: node, description: `Visiting node ${node}` };

      const neighbors = graph[node] || [];
      yield { type: "explore", node: node, neighbors, description: `Exploring neighbors of ${node}: ${neighbors.join(", ")}` };

      // Push in reverse order to visit in order (optional, but standard for stack DFS)
      for (let i = neighbors.length - 1; i >= 0; i--) {
        const neighbor = neighbors[i];
        if (!visited.has(neighbor)) {
          stack.push(neighbor);
          yield { type: "queue", node: neighbor, description: `Pushing neighbor ${neighbor} to stack` };
        }
      }
    }
  }
}
