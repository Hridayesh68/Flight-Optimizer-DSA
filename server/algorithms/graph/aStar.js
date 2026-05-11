const MinHeap = require('../priorityQueue/MinHeap');

// Helper to calculate Haversine distance between two coordinates
function calculateHaversine(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

/**
 * A* (A-Star) Algorithm for Flight Networks
 * @param {Map} graphList - Adjacency list map of flights
 * @param {string} startNode - IATA code of source
 * @param {string} endNode - IATA code of destination
 * @param {string} weightField - 'distance', 'duration', or 'price'
 * @param {Map} nodesMap - Map of airport metadata
 * @returns {Object} { path, visitedCount, totalDistance, totalDuration, totalCost, airlinesUsed }
 */
function aStar(graphList, startNode, endNode, weightField, nodesMap) {
    const startTime = process.hrtime();
    const distances = new Map();
    const previous = new Map();
    const edgeUsed = new Map();
    let visitedCount = 0;

    const targetAirport = nodesMap.get(endNode);

    for (const [node] of graphList.entries()) {
        distances.set(node, Infinity);
        previous.set(node, null);
    }

    if (!distances.has(startNode)) return { path: [], visitedCount: 0 };

    distances.set(startNode, 0);
    const pq = new MinHeap();

    const heuristic = (nodeCode) => {
        if (weightField === 'price' || !targetAirport) return 0;
        const currentAirport = nodesMap.get(nodeCode);
        if (!currentAirport) return 0;

        const distanceKm = calculateHaversine(
            currentAirport.lat, currentAirport.lng,
            targetAirport.lat, targetAirport.lng
        );

        if (weightField === 'distance') return distanceKm;
        if (weightField === 'duration') return distanceKm / 15; // 900km/h
        return 0;
    };

    pq.insert({ node: startNode, priority: 0 + heuristic(startNode) });

    let found = false;

    while (!pq.isEmpty()) {
        const { node: u } = pq.extractMin();
        visitedCount++;

        if (u === endNode) {
            found = true;
            break;
        }

        const neighbors = graphList.get(u) || [];
        for (const edge of neighbors) {
            const v = edge.to;
            const weight = edge[weightField] || Infinity;

            const alt = distances.get(u) + weight;
            if (alt < distances.get(v)) {
                distances.set(v, alt);
                previous.set(v, u);
                edgeUsed.set(v, edge);
                pq.insert({ node: v, priority: alt + heuristic(v) });
            }
        }
    }

    if (!found) {
        return { path: [], visitedCount };
    }

    // Reconstruct
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

module.exports = aStar;
