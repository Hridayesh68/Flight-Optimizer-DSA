const express = require('express');
const router = express.Router();
const flightGraph = require('../algorithms/graph/buildFlightGraph');
const dijkstra = require('../algorithms/graph/dijkstra');
const aStar = require('../algorithms/graph/aStar');
const bfs = require('../../../algorithms/bfs');
const dfs = require('../../../algorithms/dfs');
const aviationService = require('../services/aviationService');

// Simple Rate Limiter Middleware
const rateLimitMap = new Map();
const rateLimiter = (req, res, next) => {
    const ip = req.ip;
    const now = Date.now();
    const windowMs = 60 * 1000; // 1 minute
    const maxRequests = 30; // 30 requests per minute

    if (!rateLimitMap.has(ip)) {
        rateLimitMap.set(ip, { count: 1, startTime: now });
    } else {
        const record = rateLimitMap.get(ip);
        if (now - record.startTime > windowMs) {
            record.count = 1;
            record.startTime = now;
        } else {
            record.count++;
            if (record.count > maxRequests) {
                return res.status(429).json({ message: 'Too many requests, please try again later.' });
            }
        }
    }
    next();
};

// Apply rate limiting to all algorithm routes
router.use(rateLimiter);

// @desc    Run pathfinding algorithm for flights
// @route   POST /api/route
// @access  Public
router.post('/route', async (req, res) => {
    console.log(`[Algorithm API] Request received: ${JSON.stringify(req.body)}`);
    const { origin, destination, algorithm = 'dijkstra', optimizeBy = 'distance' } = req.body;

    if (!origin || !destination) {
        return res.status(400).json({ message: 'Origin and destination are required.' });
    }

    if (origin === destination) {
        return res.status(400).json({ message: 'Origin and destination cannot be the same.' });
    }

    const validWeights = {
        'distance': 'distance',
        'duration': 'duration',
        'cost': 'price'
    };

    const weightField = validWeights[optimizeBy];
    if (!weightField) {
        return res.status(400).json({ message: 'Invalid optimizeBy field provided. Must be distance, duration, or cost.' });
    }

    if (!['dijkstra', 'astar', 'bfs', 'dfs', 'compare'].includes(algorithm)) {
        return res.status(400).json({ message: 'Invalid algorithm selected. Must be dijkstra, astar, bfs, dfs, or compare.' });
    }

    try {
        // Ensure graph is built before algorithm runs
        await flightGraph.buildGraph();

        const graphList = flightGraph.getGlobalGraph();
        console.log(`[Algorithm API] Graph size: ${graphList.size} nodes.`);

        // Verify nodes exist
        if (!graphList.has(origin) || !graphList.has(destination)) {
            return res.status(400).json({ message: 'Invalid airport IATA codes provided. Airport does not exist in graph.' });
        }

        console.log(`[Algorithm API] Running ${algorithm} optimizing for ${weightField}`);

        // Helper to run and compile an algorithm
        const runAlgorithm = (algName) => {
            const startTime = performance.now();
            let result = null;

            if (algName === 'dijkstra') result = dijkstra(graphList, origin, destination, weightField);
            else if (algName === 'astar') result = aStar(graphList, origin, destination, weightField, flightGraph.nodes);
            else if (algName === 'bfs') result = bfs(graphList, origin, destination);
            else if (algName === 'dfs') result = dfs(graphList, origin, destination);

            const endTime = performance.now();
            const executionTimeMs = (endTime - startTime).toFixed(3);

            if (!result || !result.path || result.path.length === 0) {
                return null;
            }

            let totalDistance = 0;
            let totalDuration = 0;
            let totalCost = 0;
            let airlinesUsed = new Set();
            let nodesVisited = result.visitedCount || 0;

            // Haversine fallback helper
            const R = 6371;
            const haversineDist = (lat1, lon1, lat2, lon2) => {
                const dLat = (lat2 - lat1) * Math.PI / 180;
                const dLon = (lon2 - lon1) * Math.PI / 180;
                const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
                return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            };

            for (let i = 0; i < result.path.length - 1; i++) {
                const currentCode = result.path[i];
                const nextCode = result.path[i + 1];
                const edges = graphList.get(currentCode) || [];
                const flightTaken = edges.find(e => e.to === nextCode);

                const srcNode = flightGraph.nodes.get(currentCode);
                const destNode = flightGraph.nodes.get(nextCode);

                if (flightTaken) {
                    if (flightTaken.distance) {
                        totalDistance += flightTaken.distance;
                        totalDuration += flightTaken.duration;
                        totalCost += flightTaken.price;
                    } else if (srcNode && destNode) {
                        // Dynamically calculate fallback metrics for synthetic edges that lack explicit payload
                        const hDist = Math.round(haversineDist(srcNode.lat, srcNode.lng, destNode.lat, destNode.lng));
                        totalDistance += hDist;
                        totalDuration += Math.round((hDist / 800) * 60) + 30;
                        totalCost += Math.round((hDist * 0.10) + 50);
                    }
                    if (flightTaken.airline && flightTaken.airline !== 'UNK' && flightTaken.airline !== 'DENSE') {
                        airlinesUsed.add(flightTaken.airline);
                    }
                }
            }

            return {
                algorithm: algName,
                path: result.path,
                totalDistance,
                totalDuration,
                totalCost,
                nodesVisited,
                executionTime: `${executionTimeMs}ms`,
                airlinesUsed: Array.from(airlinesUsed)
            };
        };

        if (algorithm === 'compare') {
            const results = [
                runAlgorithm('bfs'),
                runAlgorithm('dfs'),
                runAlgorithm('dijkstra'),
                runAlgorithm('astar')
            ].filter(r => r !== null);

            if (results.length === 0) {
                return res.status(404).json({ message: 'No flight route possible between these airports.' });
            }
            return res.status(200).json(results);
        } else {
            const responseObj = runAlgorithm(algorithm);
            if (!responseObj) {
                return res.status(404).json({ message: 'No flight route possible between these airports.' });
            }
            return res.status(200).json(responseObj);
        }

    } catch (error) {
        console.error("[Algorithm API] Error:", error);
        res.status(500).json({ message: 'Algorithm execution failed', error: error.message });
    }
});

// @desc    Get all airport metadata
// @route   GET /api/airports
// @access  Public
router.get('/airports', async (req, res) => {
    try {
        const response = await aviationService.getAirports(req.query);
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch airports', error: error.message });
    }
});

// @desc    Get graph airports (all nodes in the current adjacency list)
// @route   GET /api/graph/airports
// @access  Public
router.get('/graph/airports', async (req, res) => {
    try {
        await flightGraph.buildGraph();
        const nodes = Array.from(flightGraph.nodes.values());
        // Sort alphabetically by city/name for the dropdown
        nodes.sort((a, b) => (a.city || a.name).localeCompare(b.city || b.name));
        res.status(200).json(nodes);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch graph airports', error: error.message });
    }
});

// @desc    Get airlines metadata
// @route   GET /api/airlines
// @access  Public
router.get('/airlines', async (req, res) => {
    try {
        const response = await aviationService.getAirlines(req.query);
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch airlines', error: error.message });
    }
});

// @desc    Get live flights
// @route   GET /api/live-flights
// @access  Public
router.get('/live-flights', async (req, res) => {
    try {
        const airport = req.query.airport;
        const params = airport ? { arr_iata: airport } : {};
        // You could also use dep_iata depending on the desired feature
        const response = await aviationService.getFlights(params);
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch live flights', error: error.message });
    }
});

module.exports = router;
