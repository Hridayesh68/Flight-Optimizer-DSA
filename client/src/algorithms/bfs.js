/**
 * Breadth-First Search (BFS) for Flight Networks
 * Optimizes strictly for minimum edges (fewest layovers), ignoring geographic weight.
 * @param {Map} graphList - Adjacency list map of flights
 * @param {string} startNode - IATA code of source
 * @param {string} endNode - IATA code of destination
 * @returns {Object} { path, totalWeight, visitedCount }
 */
function bfs(graphList, startNode, endNode) {
    let visitedCount = 0;
    const previous = new Map();
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
                queue.push(v);
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

module.exports = bfs;
