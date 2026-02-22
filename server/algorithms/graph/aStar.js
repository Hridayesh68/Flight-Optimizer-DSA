const MinHeap = require('../priorityQueue/MinHeap');

function haversineDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the Earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

function getHeuristic(nodeStr, goalNodeStr, nodesMap, weightField) {
    if (!nodesMap) return 0; // Fallback if no map is provided

    const currentNode = nodesMap.get(nodeStr);
    const goalNode = nodesMap.get(goalNodeStr);

    if (!currentNode || !goalNode) return 0;

    const distKm = haversineDistance(currentNode.lat, currentNode.lng, goalNode.lat, goalNode.lng);

    // Convert heuristic based on the weightField optimization to remain admissible (never overestimate).
    if (weightField === 'distance') return distKm;
    if (weightField === 'duration') return (distKm / 1000) * 60; // Max speed 1000 km/h: underestimate time
    if (weightField === 'price') return distKm * 0.05; // Base price is 50 + 0.10*dist, so 0.05*dist is safe underestimate

    return distKm;
}

/**
 * A* algorithm implementation for flight networking.
 * f(n) = g(n) + h(n)
 */
function aStar(graphList, startNode, endNode, weightField, nodesMap) {
    const gScore = new Map();
    const previous = new Map();
    let visitedCount = 0;

    for (const [node] of graphList.entries()) {
        gScore.set(node, Infinity);
        previous.set(node, null);
    }

    gScore.set(startNode, 0);

    const pq = new MinHeap();
    const startH = getHeuristic(startNode, endNode, nodesMap, weightField);
    pq.insert({ node: startNode, priority: startH });

    const closedSet = new Set();

    while (!pq.isEmpty()) {
        const { node: u, priority: currentF } = pq.extractMin();

        // Prevent duplicate evaluations of the same node
        if (closedSet.has(u)) continue;
        closedSet.add(u);

        visitedCount++;

        if (u === endNode) {
            break;
        }

        const currentGScore = gScore.get(u);

        const neighbors = graphList.get(u) || [];
        for (const edge of neighbors) {
            const v = edge.to;
            const weight = edge[weightField];

            const tentative_gScore = currentGScore + weight;

            if (tentative_gScore < gScore.get(v)) {
                previous.set(v, u);
                gScore.set(v, tentative_gScore);

                const fScore = tentative_gScore + getHeuristic(v, endNode, nodesMap, weightField);
                pq.insert({ node: v, priority: fScore });
            }
        }
    }

    const path = [];
    let curr = endNode;
    while (curr) {
        path.unshift(curr);
        curr = previous.get(curr);
    }

    if (path.length > 0 && path[0] !== startNode) {
        return { path: [], totalWeight: 0, visitedCount };
    }

    return {
        path,
        totalWeight: gScore.get(endNode),
        visitedCount
    };
}

module.exports = aStar;
