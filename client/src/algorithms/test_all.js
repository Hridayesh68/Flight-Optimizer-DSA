const haversine = require('./utils/haversine');
const buildGraph = require('./graph/buildGraph');
const dijkstra = require('./graph/dijkstra');
const tspSolver = require('./tsp/tspSolver');
const mergeSort = require('./sorting/sortHotelsByPrice');
const quickSort = require('./sorting/sortAttractionsByRating');

// Mock Data
const cities = [
    { id: 0, name: 'Mumbai', lat: 19.0760, lng: 72.8777 },
    { id: 1, name: 'Pune', lat: 18.5204, lng: 73.8567 },
    { id: 2, name: 'Goa', lat: 15.2993, lng: 74.1240 },
    { id: 3, name: 'Bangalore', lat: 12.9716, lng: 77.5946 },
];

const hotels = [
    { name: 'Hotel A', price: 5000 },
    { name: 'Hotel B', price: 2000 },
    { name: 'Hotel C', price: 8000 },
];

const attractions = [
    { name: 'Spot A', rating: 4.5 },
    { name: 'Spot B', rating: 3.8 },
    { name: 'Spot C', rating: 4.9 },
];

function runTests() {
    console.log('--- Testing Haversine ---');
    const dist = haversine(cities[0].lat, cities[0].lng, cities[1].lat, cities[1].lng);
    console.log(`Mumbai to Pune: ${dist.toFixed(2)} km`);

    console.log('\n--- Testing Graph Construction ---');
    const graph = buildGraph(cities);
    console.log('Adjacency Matrix built successfully.');

    console.log('\n--- Testing Dijkstra (Mumbai to others) ---');
    const dijkstraResult = dijkstra(graph.adjacencyMatrix, 0);
    console.log('Distances:', dijkstraResult.distances.map(d => d.toFixed(2)));

    console.log('\n--- Testing TSP Solver ---');
    const tspResult = tspSolver(graph.adjacencyMatrix);
    console.log('Route:', tspResult.route.map(i => cities[i].name).join(' -> '));
    console.log('Total Distance:', tspResult.totalDistance.toFixed(2), 'km');

    console.log('\n--- Testing Merge Sort (Hotels by Price) ---');
    const sortedHotels = mergeSort(hotels, 'price', true);
    console.log(sortedHotels.map(h => `${h.name}: ${h.price}`));

    console.log('\n--- Testing Quick Sort (Attractions by Rating Desc) ---');
    const sortedAttractions = quickSort(attractions, 'rating', false);
    console.log(sortedAttractions.map(a => `${a.name}: ${a.rating}`));
}

runTests();
