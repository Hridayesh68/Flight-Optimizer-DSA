const fs = require('fs').promises;
const path = require('path');
const haversine = require('../utils/haversine');

class FlightGraph {
    constructor() {
        this.nodes = new Map();
        this.graphList = new Map();
        this.isBuilt = false;
    }

    async buildGraph() {
        if (this.isBuilt) return;
        try {
            const airportsPath = path.join(__dirname, '../../data/airports.json');
            const flightsPath = path.join(__dirname, '../../data/flights.json');

            const airportsData = JSON.parse(await fs.readFile(airportsPath, 'utf-8'));
            const flightsData = JSON.parse(await fs.readFile(flightsPath, 'utf-8'));

            console.log(`[FlightGraph] Loading ${airportsData.length} airports and ${flightsData.length} flights...`);

            // 1. Initialize nodes
            for (const airport of airportsData) {
                this.nodes.set(airport.code, airport);
                this.graphList.set(airport.code, []);
            }

            // 2. Load Real Flights
            for (const flight of flightsData) {
                if (this.graphList.has(flight.source) && this.graphList.has(flight.target)) {
                    this.addEdge(flight.source, flight.target, {
                        distance: flight.distance_km,
                        duration: flight.duration_min,
                        price: flight.price_usd,
                        airline: flight.airline
                    });
                }
            }

            // 3. KNN Generator: Ensure Connectivity
            // If an airport has fewer than 2 connections, link it to its 3 nearest neighbors
            console.log(`[FlightGraph] Generating logical connections for sparse nodes...`);
            let logicalEdges = 0;

            for (const [code, airport] of this.nodes) {
                const currentNeighbors = this.graphList.get(code);
                
                // If isolated or weakly connected
                if (currentNeighbors.length < 2) {
                    const distances = [];
                    for (const [otherCode, otherAirport] of this.nodes) {
                        if (code === otherCode) continue;
                        
                        const dist = haversine(
                            airport.lat, airport.lng,
                            otherAirport.lat, otherAirport.lng
                        );
                        distances.push({ code: otherCode, dist });
                    }

                    // Sort by distance and take top 3 nearest
                    distances.sort((a, b) => a.dist - b.dist);
                    const nearest = distances.slice(0, 3);

                    for (const target of nearest) {
                        // Avoid duplicate edges
                        if (!currentNeighbors.find(n => n.to === target.code)) {
                            this.addEdge(code, target.code, {
                                distance: Math.round(target.dist),
                                duration: Math.round(target.dist / 12) + 30, // Approx 720km/h + 30m buffer
                                price: Math.round(target.dist * 0.12) + 20, // Approx $0.12 per km
                                airline: "Connecting Flight"
                            });
                            logicalEdges++;
                        }
                    }
                }
            }

            this.isBuilt = true;
            console.log(`[FlightGraph] Graph built successfully with ${this.nodes.size} nodes.`);
            console.log(`[FlightGraph] Added ${logicalEdges} logical edges via KNN.`);
            
        } catch (error) {
            console.error("[FlightGraph] Failed to build graph", error);
            throw error;
        }
    }

    addEdge(source, target, data) {
        // Forward
        this.graphList.get(source).push({
            to: target,
            ...data
        });
        // Backward (Undirected)
        this.graphList.get(target).push({
            to: source,
            ...data
        });
    }

    getGlobalGraph() {
        return this.graphList;
    }
}

module.exports = new FlightGraph();
