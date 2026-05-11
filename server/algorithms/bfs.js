/**
 * Breadth-First Search (BFS) for Flight Networks
 * Optimizes strictly for minimum edges (fewest layovers), ignoring geographic weight.
 * @param {Map} graphList - Adjacency list map of flights
 * @param {string} startNode - IATA code of source
 * @param {string} endNode - IATA code of destination
 * @returns {Object} { path, visitedCount, totalDistance, totalDuration, totalCost, airlinesUsed }
 */
function bfs(graphList, startNode, endNode) {
    const startTime = process.hrtime();
    let visitedCount = 0;
    const previous = new Map();
    const edgeUsed = new Map();
    const visited = new Set();
    const queue = [startNode];

    visited.add(startNode);
    previous.set(startNode, null);

    let found = false;

    while (queue.length > 0) {
        const u = queue.shift();
        visitedCount++;

        if (u === endNode) {
            found = true;
            break;
        }

        const neighbors = graphList.get(u) || [];
        for (const edge of neighbors) {
            const v = edge.to;
            if (!visited.has(v)) {
                visited.add(v);
                previous.set(v, u);
                edgeUsed.set(v, edge);
                queue.push(v);
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

module.exports = bfs;
