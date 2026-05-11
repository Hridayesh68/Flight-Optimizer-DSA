/**
 * Depth-First Search (DFS) for Flight Networks
 * Unoptimized. Returns the first valid path it stumbles upon.
 * @param {Map} graphList - Adjacency list map of flights
 * @param {string} startNode - IATA code of source
 * @param {string} endNode - IATA code of destination
 * @returns {Object} { path, visitedCount, totalDistance, totalDuration, totalCost, airlinesUsed }
 */
function dfs(graphList, startNode, endNode) {
    const startTime = process.hrtime();
    let visitedCount = 0;
    const visited = new Set();
    const stack = [];

    // Store { node, pathSoFar, edgesSoFar }
    stack.push({ node: startNode, pathSoFar: [startNode], edgesSoFar: [] });

    while (stack.length > 0) {
        if (visitedCount > 50000) break;

        const { node, pathSoFar, edgesSoFar } = stack.pop();

        if (!visited.has(node)) {
            visited.add(node);
            visitedCount++;

            if (node === endNode) {
                const airlines = new Set();
                let totalDist = 0;
                let totalDur = 0;
                let totalPrice = 0;

                edgesSoFar.forEach(edge => {
                    totalDist += edge.distance || 0;
                    totalDur += edge.duration || 0;
                    totalPrice += edge.price || 0;
                    if (edge.airline) airlines.add(edge.airline);
                });

                const endTime = process.hrtime(startTime);
                const executionTime = `${(endTime[0] * 1000 + endTime[1] / 1000000).toFixed(3)}ms`;

                return {
                    path: pathSoFar,
                    visitedCount,
                    totalDistance: totalDist,
                    totalDuration: totalDur,
                    totalCost: totalPrice,
                    airlinesUsed: Array.from(airlines),
                    executionTime
                };
            }

            const neighbors = graphList.get(node) || [];
            for (const edge of neighbors) {
                const nextNode = edge.to;
                if (!visited.has(nextNode)) {
                    stack.push({
                        node: nextNode,
                        pathSoFar: [...pathSoFar, nextNode],
                        edgesSoFar: [...edgesSoFar, edge]
                    });
                }
            }
        }
    }

    return { path: [], visitedCount };
}

module.exports = dfs;
