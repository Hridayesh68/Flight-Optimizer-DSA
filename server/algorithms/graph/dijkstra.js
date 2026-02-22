const MinHeap = require('../priorityQueue/MinHeap');

/**
 * Dijkstra's Algorithm for Flight Networks (Adjacency List)
 * @param {Map} graphList - Adjacency list map of flights
 * @param {string} startNode - IATA code of source
 * @param {string} endNode - IATA code of destination
 * @param {string} weightField - 'distance', 'duration', or 'price'
 * @returns {Object} { path, totalWeight, distances, previous, visitedCount }
 */
function dijkstra(graphList, startNode, endNode, weightField) {
    const distances = new Map();
    const previous = new Map();
    let visitedCount = 0;

    // Initialize all nodes in map to Infinity
    for (const [node] of graphList.entries()) {
        distances.set(node, Infinity);
        previous.set(node, null);
    }

    distances.set(startNode, 0);
    const pq = new MinHeap();
    pq.insert({ node: startNode, priority: 0 });

    while (!pq.isEmpty()) {
        const { node: u, priority: currentDist } = pq.extractMin();
        visitedCount++;

        // Stop early if we reached destination (Dijkstra optimization)
        if (u === endNode) {
            break;
        }

        // If we extracted a stale path that is longer, ignore
        if (currentDist > distances.get(u)) continue;

        const neighbors = graphList.get(u) || [];
        for (const edge of neighbors) {
            const v = edge.to;
            const weight = edge[weightField]; // Dynamically pull distance, duration, or price

            const alt = distances.get(u) + weight;
            if (alt < distances.get(v)) {
                distances.set(v, alt);
                previous.set(v, u);
                pq.insert({ node: v, priority: alt });
            }
        }
    }

    // Reconstruct Route
    const path = [];
    let curr = endNode;
    while (curr) {
        path.unshift(curr);
        curr = previous.get(curr);
    }

    // Check if path is actually valid
    if (path.length > 0 && path[0] !== startNode) {
        return { path: [], totalWeight: 0, visitedCount };
    }

    return {
        path,
        totalWeight: distances.get(endNode),
        distances,
        previous,
        visitedCount
    };
}

module.exports = dijkstra;
