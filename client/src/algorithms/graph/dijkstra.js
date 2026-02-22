const MinHeap = require('../priorityQueue/MinHeap');

/**
 * Dijkstra's Algorithm to find shortest paths from a start node.
 * @param {Array<Array<number>>} graph - Adjacency matrix of distances
 * @param {number} startNodeIndex - Index of the starting node
 * @returns {Object} Distances and previous node pointers
 */
function dijkstra(graph, startNodeIndex) {
    const n = graph.length;
    const distances = Array(n).fill(Infinity);
    const previous = Array(n).fill(null);
    const pq = new MinHeap();

    distances[startNodeIndex] = 0;
    pq.insert({ node: startNodeIndex, priority: 0 });

    while (!pq.isEmpty()) {
        const { node: u, priority: currentDist } = pq.extractMin();

        if (currentDist > distances[u]) continue;

        for (let v = 0; v < n; v++) {
            if (graph[u][v] > 0) { // If there is an edge
                const alt = distances[u] + graph[u][v];
                if (alt < distances[v]) {
                    distances[v] = alt;
                    previous[v] = u;
                    pq.insert({ node: v, priority: alt });
                }
            }
        }
    }

    return { distances, previous };
}

module.exports = dijkstra;
