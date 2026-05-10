const fs = require('fs').promises;
const path = require('path');

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

            // Initialize nodes and empty adjacency list
            for (const airport of airportsData) {
                this.nodes.set(airport.code, airport);
                this.graphList.set(airport.code, []);
            }

            // Populate adjacency list
            for (const flight of flightsData) {
                if (this.graphList.has(flight.source) && this.graphList.has(flight.target)) {
                    // Forward edge
                    this.graphList.get(flight.source).push({
                        to: flight.target,
                        distance: flight.distance_km,
                        duration: flight.duration_min,
                        price: flight.price_usd,
                        airline: flight.airline
                    });
                    
                    // Backward edge (make graph undirected)
                    this.graphList.get(flight.target).push({
                        to: flight.source,
                        distance: flight.distance_km,
                        duration: flight.duration_min,
                        price: flight.price_usd,
                        airline: flight.airline
                    });
                }
            }
            
            this.isBuilt = true;
            console.log(`[FlightGraph] Graph built successfully with ${this.nodes.size} nodes.`);
        } catch (error) {
            console.error("[FlightGraph] Failed to build graph", error);
            throw error;
        }
    }

    getGlobalGraph() {
        return this.graphList;
    }
}

module.exports = new FlightGraph();
