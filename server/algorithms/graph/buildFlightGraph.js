const aviationService = require('../../services/aviationService');
const airportsData = require('../../data/airports.json');
const flightsFallback = require('../../data/flights.json');

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

class FlightGraph {
    constructor() {
        this.adjacencyList = new Map();
        this.nodes = new Map();
        this.isBuilt = false;
        this.lastBuildTime = null;
    }

    async buildGraph() {
        // Refresh every 10 minutes (600000 ms)
        if (this.isBuilt && this.lastBuildTime && (Date.now() - this.lastBuildTime < 600000)) {
            return;
        }

        console.log("Building dynamic flight graph...");

        try {
            this.adjacencyList = new Map();
            this.nodes = new Map();

            // 1. Initialize nodes (Airports)
            // Seed from our known reliable dataset
            for (let apt of airportsData) {
                this.nodes.set(apt.code, {
                    code: apt.code,
                    name: apt.name,
                    city: apt.city,
                    state: apt.state,
                    country: apt.country,
                    lat: apt.lat,
                    lng: apt.lng
                });
                this.adjacencyList.set(apt.code, []);
            }

            // Attempt to augment with AviationStack Airports API (Prioritize Indian Airports)
            try {
                const apiAirportsRes = await aviationService.getAirports({ limit: 300, searchBy: 'country_name', country_name: 'India' });
                if (apiAirportsRes && apiAirportsRes.data) {
                    apiAirportsRes.data.forEach(apt => {
                        if (apt.iata_code && !this.nodes.has(apt.iata_code) && apt.latitude && apt.longitude) {
                            this.nodes.set(apt.iata_code, {
                                code: apt.iata_code,
                                name: apt.airport_name,
                                city: apt.city_iata_code || apt.iata_code,
                                country: apt.country_name,
                                lat: parseFloat(apt.latitude),
                                lng: parseFloat(apt.longitude)
                            });
                            this.adjacencyList.set(apt.iata_code, []);
                        }
                    });
                }
            } catch (err) {
                console.warn("Could not fetch airports from AviationStack (rate limit or network error). Proceeding with local dataset.");
            }

            // 2. Build edges (Routes)
            let addedEdges = 0;
            try {
                // We fetch routes and apply them to our nodes.
                const apiRoutesRes = await aviationService.getRoutes({ limit: 1000 });
                if (apiRoutesRes && apiRoutesRes.data) {
                    apiRoutesRes.data.forEach(route => {
                        const src = route.departure?.iata;
                        const dest = route.arrival?.iata;
                        const airline = route.airline?.iata || 'UNK';

                        if (src && dest && this.nodes.has(src) && this.nodes.has(dest) && src !== dest) {
                            if (!this.hasEdge(src, dest)) {
                                this.addEdge(src, dest, airline);
                                addedEdges++;
                            }
                        }
                    });
                }
            } catch (err) {
                console.warn("Could not fetch routes from AviationStack. Proceeding with local dataset.");
            }
            console.log(`Added ${addedEdges} edges from AviationStack API.`);

            // Fallback: Ensure algorithms can find paths between major hubs if API didn't return them (due to pagination/limits)
            let fallbackEdges = 0;
            flightsFallback.forEach(flight => {
                if (this.nodes.has(flight.source) && this.nodes.has(flight.target)) {
                    if (!this.hasEdge(flight.source, flight.target)) {
                        this.addEdge(flight.source, flight.target, flight.airline);
                        fallbackEdges++;
                    }
                    if (!this.hasEdge(flight.target, flight.source)) {
                        this.addEdge(flight.target, flight.source, flight.airline);
                        fallbackEdges++;
                    }
                }
            });
            console.log(`Added ${fallbackEdges} edges from Fallback Data.`);

            // 3. Dense Edge Connectivity (K-Nearest Neighbors)
            console.log("Generating dense logical connections for algorithm benchmarking...");
            let generatedEdges = 0;
            const allNodesList = Array.from(this.nodes.values());

            for (let i = 0; i < allNodesList.length; i++) {
                const source = allNodesList[i];

                // Calculate distance to all other nodes
                const distances = [];
                for (let j = 0; j < allNodesList.length; j++) {
                    if (i === j) continue;
                    const dest = allNodesList[j];
                    const dist = haversineDistance(source.lat, source.lng, dest.lat, dest.lng);
                    distances.push({ destCode: dest.code, dist });
                }

                // Sort by distance and take top 10
                distances.sort((a, b) => a.dist - b.dist);
                const nearestNeighbors = distances.slice(0, 10);

                // Add edges bidirectionally
                for (let neighbor of nearestNeighbors) {
                    if (!this.hasEdge(source.code, neighbor.destCode)) {
                        this.addEdge(source.code, neighbor.destCode, 'DENSE');
                        generatedEdges++;
                    }
                    if (!this.hasEdge(neighbor.destCode, source.code)) {
                        this.addEdge(neighbor.destCode, source.code, 'DENSE');
                        generatedEdges++;
                    }
                }
            }
            console.log(`Added ${generatedEdges} logical edges from KNN generation.`);

            this.isBuilt = true;
            this.lastBuildTime = Date.now();
            console.log(`Graph built successfully with ${this.nodes.size} nodes and ${addedEdges + fallbackEdges + generatedEdges} total edges.`);

        } catch (error) {
            console.error("Critical error while building graph:", error);
            throw error;
        }
    }

    hasEdge(src, dest) {
        if (!this.adjacencyList.has(src)) return false;
        return this.adjacencyList.get(src).some(e => e.to === dest);
    }

    // Calculates metrics dynamically
    addEdge(src, dest, airline) {
        const srcNode = this.nodes.get(src);
        const destNode = this.nodes.get(dest);

        if (!srcNode || !destNode) return;

        // Haversine distance
        const distance = Math.round(haversineDistance(srcNode.lat, srcNode.lng, destNode.lat, destNode.lng));

        // Duration: estimate 800 km/h, add 30 mins for takeoff/landing
        const duration = Math.round((distance / 800) * 60) + 30;

        // Cost: simulated pricing ($0.10 per km + base $50)
        const price = Math.round((distance * 0.10) + 50);

        this.adjacencyList.get(src).push({
            to: dest,
            distance,
            duration,
            price,
            airline
        });
    }

    getGlobalGraph() {
        return this.adjacencyList;
    }

    getAirport(code) {
        return this.nodes.get(code);
    }
}

const flightGraphInstance = new FlightGraph();
module.exports = flightGraphInstance;
