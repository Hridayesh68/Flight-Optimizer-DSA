const MinHeap = require('../priorityQueue/MinHeap');
const flightGraph = require('./buildFlightGraph');

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
 * @returns {Object} { path, totalWeight, distances, previous, visitedCount }
 */
function aStar(graphList, startNode, endNode, weightField) {
    const distances = new Map();
    const previous = new Map();
    let visitedCount = 0;

    // Get target coordinates for heuristic
    const targetAirport = flightGraph.getAirport(endNode);

    // Initialize all nodes in map to Infinity
    for (const [node] of graphList.entries()) {
        distances.set(node, Infinity);
        previous.set(node, null);
    }

    distances.set(startNode, 0);
    const pq = new MinHeap();


    // Define Heuristic function dynamically based on weightType
    const heuristic = (nodeCode) => {
        // If optimizing by price, we don't have a reliable geographic heuristic, so A* degrades to Dijkstra
        if (weightField === 'price' || !targetAirport) return 0;

        const currentAirport = flightGraph.getAirport(nodeCode);
        if (!currentAirport) return 0;

        const distanceKm = calculateHaversine(
            currentAirport.lat, currentAirport.lng,
            targetAirport.lat, targetAirport.lng
        );

        if (weightField === 'distance') return distanceKm;
        if (weightField === 'duration') return distanceKm / 15; // Rough estimate of 900km/h (15km/min)
        return 0;
    };

    pq.insert({ node: startNode, priority: 0 + heuristic(startNode) });

    while (!pq.isEmpty()) {
        const { node: u } = pq.extractMin();
        visitedCount++;

        if (u === endNode) break;

        const neighbors = graphList.get(u) || [];
        for (const edge of neighbors) {
            const v = edge.to;
            const weight = edge[weightField];

            const alt = distances.get(u) + weight;
            if (alt < distances.get(v)) {
                distances.set(v, alt);
                previous.set(v, u);
                pq.insert({ node: v, priority: alt + heuristic(v) });
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

module.exports = aStar;
