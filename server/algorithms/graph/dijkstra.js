const MinHeap = require('../priorityQueue/MinHeap');

/**
 * Dijkstra's Algorithm to find shortest paths from a start node to an end node
 * Optimizes for a specific weight field (distance, duration, price)
 * @param {Map} graphList - Adjacency list map of flights
 * @param {string} startNode - IATA code of source
 * @param {string} endNode - IATA code of destination
 * @param {string} weightField - Field to optimize (distance, duration, price)
 * @returns {Object} { path, visitedCount }
 */
function dijkstra(graphList, startNode, endNode, weightField) {
    let visitedCount = 0;
    const distances = new Map();
    const previous = new Map();
    const pq = new MinHeap();

    // Initialize all distances to Infinity
    for (const node of graphList.keys()) {
        distances.set(node, Infinity);
        previous.set(node, null);
    }

    distances.set(startNode, 0);
    pq.insert({ node: startNode, priority: 0 });

    let found = false;

    while (!pq.isEmpty()) {
        const { node: u, priority: currentDist } = pq.extractMin();
        visitedCount++;

        if (u === endNode) {
            found = true;
            break;
        }

        // Optimization: If extracted distance is greater than known distance, skip
        if (currentDist > distances.get(u)) continue;

        const neighbors = graphList.get(u) || [];
        for (const edge of neighbors) {
            const v = edge.to;
            const weight = edge[weightField] || Infinity; // Ensure weight exists
            
            const alt = distances.get(u) + weight;
            if (alt < distances.get(v)) {
                distances.set(v, alt);
                previous.set(v, u);
                pq.insert({ node: v, priority: alt });
            }
        }
    }

    if (!found) {
        return { path: [], visitedCount };
    }

    // Reconstruct Route
    const path = [];
    let curr = endNode;
    while (curr) {
        path.unshift(curr);
        curr = previous.get(curr);
    }

    return {
        path,
        visitedCount
    };
}

module.exports = dijkstra;
