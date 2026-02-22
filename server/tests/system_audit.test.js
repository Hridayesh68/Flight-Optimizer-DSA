const axios = require('axios');
const flightGraph = require('../algorithms/graph/buildFlightGraph');
const dijkstra = require('../algorithms/graph/dijkstra');
const aStar = require('../algorithms/graph/aStar');
const dotenv = require('dotenv');
const path = require('path');

// Ensure env is loaded for direct function tests
dotenv.config({ path: path.join(__dirname, '../../.env') });

async function runTests() {
    console.log("==================================================");
    console.log("FLIGHT ROUTE OPTIMIZER - FULL SYSTEM QA AUDIT");
    console.log("==================================================");
    let passed = 0;
    let failed = 0;

    const assert = (condition, message) => {
        if (condition) {
            console.log(`✅ [PASS] ${message}`);
            passed++;
        } else {
            console.error(`❌ [FAIL] ${message}`);
            failed++;
        }
    };

    // 1. Backend Server & Health Validation
    try {
        const res = await axios.get('http://localhost:5000/api/health');
        assert(res.status === 200 && res.data.status === 'ok', 'Server Health Endpoint is active');
    } catch (err) {
        assert(false, `Server Health Endpoint failed: ${err.message}`);
    }

    // 2. AviationStack Integration Validation
    try {
        const res = await axios.get('http://localhost:5000/api/airports?limit=5');
        assert(res.status === 200 && Array.isArray(res.data.data), 'AviationStack API Airports endpoint returns proper data format');
    } catch (err) {
        let msg = err.response ? err.response.data.message : err.message;
        assert(false, `AviationStack API failed: ${msg}`);
    }

    // 3. Graph Construction Validation
    try {
        console.log("\n[Building Graph...]");
        await flightGraph.buildGraph();
        const graph = flightGraph.getGlobalGraph();
        let valid = graph.size > 0 && Array.isArray(graph.get('DEL')) && graph.get('DEL').length > 0;
        assert(valid, `Flight Graph built successfully. Size: ${graph.size} nodes.`);

        const delEdges = graph.get('DEL');
        // Validate weights exist
        const sampleEdge = delEdges[0];
        assert(sampleEdge.distance !== undefined && sampleEdge.duration !== undefined && sampleEdge.price !== undefined, 'Weights (distance, duration, cost) exist on edges');
    } catch (err) {
        assert(false, `Graph construction failed: ${err.message}`);
    }

    // 4. Algorithm Testing
    try {
        console.log("\n[Testing Algorithms...]");
        const graph = flightGraph.getGlobalGraph();

        // Dijkstra Setup
        const start = performance.now();
        const resultD = dijkstra(graph, 'DEL', 'LHR', 'distance');
        const timeD = performance.now() - start;

        // A* Setup
        const start2 = performance.now();
        const resultA = aStar(graph, 'DEL', 'LHR', 'distance', flightGraph.nodes);
        const timeA = performance.now() - start2;

        assert(resultD.path.length > 0 && resultD.path[0] === 'DEL' && resultD.path[resultD.path.length - 1] === 'LHR', 'Dijkstra finds correct path DEL -> LHR');
        assert(resultA.path.length > 0 && resultA.path[0] === 'DEL' && resultA.path[resultA.path.length - 1] === 'LHR', 'A* finds correct path DEL -> LHR');
        assert(resultD.totalWeight === resultA.totalWeight, 'A* and Dijkstra return same optimal optimal distance (admissible)');
        console.log(`[Perf] Dijkstra Time: ${timeD.toFixed(3)}ms (Visited: ${resultD.visitedCount})`);
        console.log(`[Perf] A* Time: ${timeA.toFixed(3)}ms (Visited: ${resultA.visitedCount})`);

        // Edge case: Same origin/dest directly bypassing express middleware
        const resultSame = dijkstra(graph, 'DEL', 'DEL', 'distance');
        assert(resultSame.totalWeight === 0 && resultSame.path.length === 1, 'Same origin & destination handled natively correctly in memory');
    } catch (err) {
        assert(false, `Algorithm testing failed: ${err.message}`);
    }

    // 5. Main Route API POST Validation
    try {
        console.log("\n[Testing /api/route endpoint...]");
        const payload = {
            origin: "DEL",
            destination: "LHR",
            algorithm: "astar",
            optimizeBy: "cost"
        };
        const res = await axios.post('http://localhost:5000/api/route', payload);
        const d = res.data;

        let isValidShape = d.path && Array.isArray(d.path) && d.totalCost !== undefined && d.executionTime;
        assert(isValidShape, '/api/route returned structured format successfully');

        // Negative test: invalid payload
        try {
            await axios.post('http://localhost:5000/api/route', { origin: 'FAKE1', destination: 'FAKE2' });
            assert(false, 'Expected API to reject missing nodes');
        } catch (e) {
            assert(e.response && e.response.status === 400, 'API correctly rejects invalid/missing airports');
        }

    } catch (err) {
        assert(false, `/api/route POST failed: ${err.message}`);
    }

    console.log(`\n==================================================`);
    console.log(`AUDIT COMPLETE. PASS: ${passed}, FAIL: ${failed}`);
    process.exit(failed > 0 ? 1 : 0);
}

runTests();
