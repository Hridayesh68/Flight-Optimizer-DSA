const axios = require('axios');

async function testOptimization() {
    const cities = [
        { id: 0, name: 'Mumbai', lat: 19.0760, lng: 72.8777 },
        { id: 1, name: 'Pune', lat: 18.5204, lng: 73.8567 },
        { id: 2, name: 'Goa', lat: 15.2993, lng: 74.1240 },
        { id: 3, name: 'Bangalore', lat: 12.9716, lng: 77.5946 },
    ];

    try {
        const response = await axios.post('http://localhost:5000/api/trips/optimize', { cities });
        console.log('--- Optimization Result ---');
        console.log(`Total Distance: ${response.data.totalDistance} km`);
        console.log('Optimized Route:');
        response.data.optimizedRoute.forEach((city, index) => {
            console.log(`${index + 1}. ${city.name}`);
        });
    } catch (error) {
        console.error('Test Failed:', error.response ? error.response.data : error.message);
    }
}

testOptimization();
