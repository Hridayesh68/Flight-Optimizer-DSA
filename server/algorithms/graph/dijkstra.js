const MinHeap = require('../priorityQueue/MinHeap');

/**
 * Dijkstra's Algorithm to find shortest paths from a start node to an end node
 * Optimizes for a specific weight field (distance, duration, price)
 * @param {Map} graphList - Adjacency list map of flights
 * @param {string} startNode - IATA code of source
 * @param {string} endNode - IATA code of destination
 * @param {string} weightField - Field to optimize (distance, duration, price)
 * @returns {Object} { path, visitedCount, totalDistance, totalDuration, totalCost, airlinesUsed }
 */
function dijkstra(graphList, startNode, endNode, weightField) {
    const startTime = process.hrtime();
    let visitedCount = 0;
    const distances = new Map();
    const previous = new Map();
    const edgeUsed = new Map(); // Store the actual edge object used to reach node v
    const pq = new MinHeap();

    // Initialize all nodes
    for (const node of graphList.keys()) {
        distances.set(node, Infinity);
        previous.set(node, null);
    }

    if (!distances.has(startNode)) {
        return { path: [], visitedCount: 0 };
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

        if (currentDist > distances.get(u)) continue;

        const neighbors = graphList.get(u) || [];
        for (const edge of neighbors) {
            const v = edge.to;
            const weight = edge[weightField] || Infinity;
            
            const alt = distances.get(u) + weight;
            if (alt < distances.get(v)) {
                distances.set(v, alt);
                previous.set(v, u);
                edgeUsed.set(v, edge);
                pq.insert({ node: v, priority: alt });
            }
        }
    }

    if (!found) {
        return { path: [], visitedCount };
    }

    // Reconstruct Route and aggregate metrics
    const path = [];
    const airlines = new Set();
    let totalDist = 0;
    let totalDur = 0;
    let totalPrice = 0;
    
    let curr = endNode;
    while (curr) {
        path.unshift(curr);
        const edge = edgeUsed.get(curr);
        if (edge) {
            totalDist += edge.distance || 0;
            totalDur += edge.duration || 0;
            totalPrice += edge.price || 0;
            if (edge.airline) airlines.add(edge.airline);
        }
        curr = previous.get(curr);
    }

    const endTime = process.hrtime(startTime);
    const executionTime = `${(endTime[0] * 1000 + endTime[1] / 1000000).toFixed(3)}ms`;

    return {
        path,
        visitedCount,
        totalDistance: totalDist,
        totalDuration: totalDur,
        totalCost: totalPrice,
        airlinesUsed: Array.from(airlines),
        executionTime
    };
}

module.exports = dijkstra;
