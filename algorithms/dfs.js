/**
 * Depth-First Search (DFS) for Flight Networks
 * Unoptimized. Returns the first valid path it stumbles upon.
 * Safely guards against deep infinite cycles.
 * @param {Map} graphList - Adjacency list map of flights
 * @param {string} startNode - IATA code of source
 * @param {string} endNode - IATA code of destination
 * @returns {Object} { path, visitedCount }
 */
function dfs(graphList, startNode, endNode) {
    let visitedCount = 0;
    const visited = new Set();
    const stack = [];

    // We store { node, pathSoFar }
    stack.push({ node: startNode, pathSoFar: [startNode] });

    while (stack.length > 0) {
        // Enforce hard cap to prevent infinite memory spinlock
        if (visitedCount > 50000) break;

        const { node, pathSoFar } = stack.pop();

        if (!visited.has(node)) {
            visited.add(node);
            visitedCount++;

            if (node === endNode) {
                return { path: pathSoFar, visitedCount };
            }

            const neighbors = graphList.get(node) || [];
            // To prevent massive object cloning, we only clone the array if we push to stack
            for (const edge of neighbors) {
                const nextNode = edge.to;
                // Avoid obvious cycles
                if (!visited.has(nextNode)) {
                    stack.push({
                        node: nextNode,
                        pathSoFar: [...pathSoFar, nextNode]
                    });
                }
            }
        }
    }

    return { path: [], visitedCount };
}

module.exports = dfs;
