const express = require('express');
const router = express.Router();
const flightGraph = require('../algorithms/graph/buildGraph');
const dijkstra = require('../algorithms/graph/dijkstra');
const aStar = require('../algorithms/graph/aStar');
const bfs = require('../algorithms/bfs');
const dfs = require('../algorithms/dfs');
const aviationService = require('../services/aviationService');

// Simple Rate Limiter Middleware
const rateLimitMap = new Map();
const RATE_LIMIT_MS = 1000; // 1 second per search

const rateLimiter = (req, res, next) => {
    const ip = req.ip;
    const now = Date.now();
    if (rateLimitMap.has(ip) && now - rateLimitMap.get(ip) < RATE_LIMIT_MS) {
        return res.status(429).json({ message: 'Please wait before searching again.' });
    }
    rateLimitMap.set(ip, now);
    next();
};

// @desc    Calculate optimal flight route
// @route   POST /api/route
// @access  Public
router.post('/route', rateLimiter, async (req, res) => {
    console.log(`[Algorithm API] Request received: ${JSON.stringify(req.body)}`);
    let { origin, destination, algorithm = 'dijkstra', optimizeBy = 'distance' } = req.body;

    // Sanitize inputs
    origin = origin?.trim().toUpperCase();
    destination = destination?.trim().toUpperCase();
    algorithm = algorithm?.toLowerCase();

    if (!origin || !destination) {
        return res.status(400).json({ message: 'Origin and destination are required.' });
    }

    const validWeights = {
        'distance': 'distance',
        'duration': 'duration',
        'cost': 'price'
    };

    const weightField = validWeights[optimizeBy] || 'distance';

    try {
        // Ensure graph is built before algorithm runs
        await flightGraph.buildGraph();

        const graphList = flightGraph.getGlobalGraph();

        // Verify nodes exist
        if (!graphList.has(origin)) {
            return res.status(400).json({ message: `Origin airport ${origin} does not exist in graph.` });
        }
        if (!graphList.has(destination)) {
            return res.status(400).json({ message: `Destination airport ${destination} does not exist in graph.` });
        }

        console.log(`[Algorithm API] Running ${algorithm} optimizing for ${weightField}`);

        const runAlgorithm = async (algName, start, end, field) => {
            let result;
            if (algName === 'dijkstra') result = dijkstra(graphList, start, end, field);
            else if (algName === 'astar') result = aStar(graphList, start, end, field, flightGraph.nodes);
            else if (algName === 'bfs') result = bfs(graphList, start, end);
            else if (algName === 'dfs') result = dfs(graphList, start, end);
            
            if (result && result.path && result.path.length > 0) {
                // Enrich path with metadata
                return {
                    algorithm: algName,
                    ...result,
                    totalDistance: result.totalDistance || 0,
                    totalDuration: result.totalDuration || 0,
                    totalCost: result.totalCost || 0,
                    executionTime: result.executionTime || "0ms",
                    airlinesUsed: result.airlinesUsed || []
                };
            }
            return null;
        };

        if (algorithm === 'compare') {
            const results = await Promise.all([
                runAlgorithm('dijkstra', origin, destination, weightField),
                runAlgorithm('astar', origin, destination, weightField),
                runAlgorithm('bfs', origin, destination, weightField),
                runAlgorithm('dfs', origin, destination, weightField)
            ]);
            
            const validResults = results.filter(r => r !== null);
            if (validResults.length === 0) {
                return res.status(404).json({ message: 'No flight route possible between these airports.' });
            }
            return res.status(200).json(validResults);
        } else {
            const responseObj = await runAlgorithm(algorithm, origin, destination, weightField);
            if (!responseObj) {
                return res.status(404).json({ message: 'No flight route possible between these airports.' });
            }
            return res.status(200).json(responseObj);
        }

    } catch (error) {
        console.error('Routing error:', error);
        res.status(500).json({ message: 'Internal server error during route optimization.', error: error.message });
    }
});

// @desc    Get all available airports in the graph
// @route   GET /api/graph/airports
router.get('/graph/airports', async (req, res) => {
    try {
        await flightGraph.buildGraph();
        const nodes = Array.from(flightGraph.nodes.values());
        res.status(200).json(nodes);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch airports from graph.' });
    }
});

// @desc    Get graph status (debug)
// @route   GET /api/graph/status
router.get('/graph/status', async (req, res) => {
    try {
        await flightGraph.buildGraph();
        const graphList = flightGraph.getGlobalGraph();
        let edgeCount = 0;
        graphList.forEach(neighbors => edgeCount += neighbors.length);
        
        res.status(200).json({
            nodeCount: graphList.size,
            edgeCount: edgeCount,
            nodes: Array.from(graphList.keys())
        });
    } catch (error) {
        res.status(500).json({ message: 'Failed to get graph status', error: error.message });
    }
});

module.exports = router;
