import React, { useState, useContext, useEffect } from 'react';
import { TripContext } from '../../context/TripContext';
import axios from 'axios';
import { IoPlayOutline, IoAirplaneOutline, IoWalletOutline, IoTimeOutline } from 'react-icons/io5';

// Mock list of airports to save an API call (matches server/data/airports.json)
const AIRPORTS = [
    { code: "JFK", name: "John F. Kennedy", city: "New York", country: "USA", lat: 40.6413, lng: -73.7781 },
    { code: "LHR", name: "Heathrow", city: "London", country: "UK", lat: 51.4700, lng: -0.4543 },
    { code: "DXB", name: "Dubai International", city: "Dubai", country: "UAE", lat: 25.2532, lng: 55.3657 },
    { code: "DEL", name: "Indira Gandhi", city: "New Delhi", country: "India", lat: 28.5562, lng: 77.1000 },
    { code: "BOM", name: "Chhatrapati Shivaji", city: "Mumbai", country: "India", lat: 19.0896, lng: 72.8656 },
    { code: "BLR", name: "Kempegowda", city: "Bangalore", country: "India", lat: 13.1986, lng: 77.7066 },
    { code: "HYD", name: "Rajiv Gandhi", city: "Hyderabad", country: "India", lat: 17.2403, lng: 78.4294 },
    { code: "MAA", name: "Chennai International", city: "Chennai", country: "India", lat: 12.9941, lng: 80.1709 },
    { code: "CCU", name: "Netaji Subhash Chandra Bose", city: "Kolkata", country: "India", lat: 22.6520, lng: 88.4463 },
    { code: "COK", name: "Cochin International", city: "Kochi", country: "India", lat: 10.1518, lng: 76.3930 },
    { code: "AMD", name: "Sardar Vallabhbhai Patel", city: "Ahmedabad", country: "India", lat: 23.0772, lng: 72.6347 },
    { code: "PNQ", name: "Pune Space", city: "Pune", country: "India", lat: 18.5822, lng: 73.9197 },
    { code: "GOI", name: "Dabolim", city: "Goa", country: "India", lat: 15.3808, lng: 73.8313 },
    { code: "SIN", name: "Changi", city: "Singapore", country: "Singapore", lat: 1.3644, lng: 103.9915 },
    { code: "SYD", name: "Sydney Kingsford Smith", city: "Sydney", country: "Australia", lat: -33.9399, lng: 151.1753 }
];

// Debounce Utility for generic searches
function useDebounce(value, delay) {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);
        return () => clearTimeout(handler);
    }, [value, delay]);
    return debouncedValue;
}

const AirportSearchDropdown = ({ label, airports, selectedCode, onSelect }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [isOpen, setIsOpen] = useState(false);

    // Fast local fuzzy finding
    const filteredAirports = airports.filter(a => {
        const query = searchQuery.toLowerCase();
        return (a.city && a.city.toLowerCase().includes(query)) ||
            (a.name && a.name.toLowerCase().includes(query)) ||
            (a.code && a.code.toLowerCase().includes(query));
    }).slice(0, 50); // Hard UI cap for performance

    const selectedAirport = airports.find(a => a.code === selectedCode);

    return (
        <div className="flex flex-col space-y-1 relative z-50">
            <label className="text-gray-500 font-bold text-xs uppercase tracking-wider">{label}</label>
            <div
                className="bg-gray-50 border border-gray-200 text-gray-800 rounded-lg p-3 w-full cursor-text"
                onClick={() => setIsOpen(true)}
            >
                {!isOpen ? (
                    <div className="flex flex-col">
                        <span className="font-bold">{selectedAirport?.name || 'Select Airport'} ({selectedCode})</span>
                        <span className="text-sm text-gray-500">{selectedAirport?.city || ''}{selectedAirport?.country ? `, ${selectedAirport.country}` : ''}</span>
                    </div>
                ) : (
                    <input
                        type="text"
                        autoFocus
                        className="w-full bg-transparent outline-none p-1"
                        placeholder="Search City, Name, or IATA code..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onBlur={() => setTimeout(() => setIsOpen(false), 200)}
                    />
                )}
            </div>

            {isOpen && (
                <ul className="absolute z-50 w-full mt-[68px] bg-white border border-gray-200 rounded-lg shadow-2xl max-h-64 overflow-y-auto">
                    {filteredAirports.map(apt => (
                        <li
                            key={`search-${apt.code}`}
                            className="p-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-0"
                            onClick={() => {
                                onSelect(apt.code);
                                setIsOpen(false);
                                setSearchQuery('');
                            }}
                        >
                            <div className="font-bold text-gray-800">{apt.name} <span className="text-blue-600">({apt.code})</span></div>
                            <div className="text-sm text-gray-500">{apt.city}{apt.country ? `, ${apt.country}` : ''}</div>
                        </li>
                    ))}
                    {filteredAirports.length === 0 && (
                        <li className="p-3 text-gray-500 text-sm">No airports found...</li>
                    )}
                </ul>
            )}
        </div>
    );
};

const FlightSearchBox = () => {
    const {
        setVisualizedRoute,
        setAlgorithmMetrics
    } = useContext(TripContext);

    const [origin, setOrigin] = useState('DEL');
    const [destination, setDestination] = useState('JFK');
    const [algorithm, setAlgorithm] = useState('dijkstra');
    const [optimizeBy, setOptimizeBy] = useState('cost');

    const [isCalculating, setIsCalculating] = useState(false);
    const [localMetrics, setLocalMetrics] = useState(null);
    const [airportsList, setAirportsList] = useState(AIRPORTS);

    useEffect(() => {
        const fetchGraphAirports = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/graph/airports');
                if (response.data && response.data.length > 0) {
                    setAirportsList(response.data);
                    // Optionally reset origin/destination if the current ones don't exist
                    const defaultOrig = response.data.find(a => a.code === 'DEL') || response.data[0];
                    const defaultDest = response.data.find(a => a.code === 'LHR') || response.data[1] || response.data[0];
                    setOrigin(defaultOrig.code);
                    setDestination(defaultDest.code);
                }
            } catch (err) {
                console.warn('Could not fetch dynamic airports, falling back to local list.', err);
            }
        };
        fetchGraphAirports();
    }, []);

    const handleSearch = async () => {
        if (origin === destination) {
            alert('Origin and Destination must be different.');
            return;
        }

        setIsCalculating(true);
        setLocalMetrics(null);
        setVisualizedRoute(null);

        try {
            const response = await axios.post('http://localhost:5000/api/route', {
                origin,
                destination,
                algorithm,
                optimizeBy
            });

            // Normalize response to always be an array for unified processing
            const responseDataArray = Array.isArray(response.data) ? response.data : [response.data];

            const metricsArray = [];
            const multiRoutes = [];

            responseDataArray.forEach(dataset => {
                const pCodes = dataset.path;
                const rObjs = pCodes.map(code =>
                    airportsList.find(a => a.code === code) || { code, name: code, city: code, lat: 0, lng: 0 }
                );

                multiRoutes.push({
                    type: dataset.algorithm || algorithm,
                    path: rObjs
                });

                metricsArray.push({
                    type: dataset.algorithm || algorithm,
                    distance: dataset.totalDistance,
                    time: dataset.totalDuration,
                    cost: dataset.totalCost,
                    nodes: dataset.nodesVisited,
                    executionTimeMs: dataset.executionTime ? parseFloat(dataset.executionTime) : 0,
                    airlinesUsed: dataset.airlinesUsed,
                    layovers: pCodes.length > 2 ? pCodes.length - 2 : 0
                });
            });

            setVisualizedRoute(multiRoutes);
            setLocalMetrics(metricsArray);
            setAlgorithmMetrics(metricsArray);

        } catch (error) {
            console.error('Failed to run flight optimization', error);
            if (error.response?.status === 400 || error.response?.status === 404) {
                alert(error.response?.data?.message || 'Route not found. Try a different algorithm or connected city.');
            } else {
                alert('Connection to routing server failed. Ensure Graph nodes are loaded.');
            }
        } finally {
            setIsCalculating(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 flex flex-col space-y-5">
            <div className="flex items-center space-x-2 border-b pb-3">
                <IoAirplaneOutline className="text-2xl text-blue-600" />
                <h2 className="font-bold text-gray-800 text-xl tracking-tight">Flight Router</h2>
            </div>

            {/* Origin & Destination Nodes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <AirportSearchDropdown
                    label="Origin"
                    airports={airportsList}
                    selectedCode={origin}
                    onSelect={setOrigin}
                />

                <AirportSearchDropdown
                    label="Destination"
                    airports={airportsList}
                    selectedCode={destination}
                    onSelect={setDestination}
                />
            </div>

            {/* Algorithm Graph Settings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="flex flex-col space-y-1">
                    <label className="text-gray-500 font-bold text-xs uppercase tracking-wider">Optimization Target</label>
                    <div className="flex rounded-md shadow-sm" role="group">
                        <button
                            type="button"
                            onClick={() => setOptimizeBy('cost')}
                            className={`px-4 py-2 text-sm font-medium border rounded-l-lg hover:bg-gray-100 ${optimizeBy === 'cost' ? 'bg-blue-50 text-blue-700 border-blue-200 z-10' : 'bg-white border-gray-200 text-gray-700'}`}>
                            Price
                        </button>
                        <button
                            type="button"
                            onClick={() => setOptimizeBy('duration')}
                            className={`px-4 py-2 text-sm font-medium border-t border-b border-r hover:bg-gray-100 ${optimizeBy === 'duration' ? 'bg-blue-50 text-blue-700 border-blue-200 z-10' : 'bg-white border-gray-200 text-gray-700'}`}>
                            Time
                        </button>
                        <button
                            type="button"
                            onClick={() => setOptimizeBy('distance')}
                            className={`px-4 py-2 text-sm font-medium border-t border-b border-r rounded-r-md hover:bg-gray-100 ${optimizeBy === 'distance' ? 'bg-blue-50 text-blue-700 border-blue-200 z-10' : 'bg-white border-gray-200 text-gray-700'}`}>
                            Distance
                        </button>
                    </div>
                </div>

                <div className="flex flex-col space-y-1">
                    <label className="text-gray-500 font-bold text-xs uppercase tracking-wider">Routing Algorithm</label>
                    <select
                        value={algorithm}
                        onChange={(e) => setAlgorithm(e.target.value)}
                        className="bg-gray-50 border border-gray-200 text-gray-800 rounded-lg focus:ring-2 focus:ring-blue-500 block p-2.5 w-full"
                    >
                        <option value="dijkstra">Dijkstra's Algorithm</option>
                        <option value="astar">A* (Heuristic Guided)</option>
                        <option value="bfs">BFS (Minimum Layovers)</option>
                        <option value="dfs">DFS (Any Route)</option>
                        <option value="compare">Compare All Algorithms</option>
                    </select>
                </div>
            </div>

            <button
                onClick={handleSearch}
                disabled={isCalculating || origin === destination}
                className="w-full flex items-center justify-center p-3.5 mt-2 rounded-xl font-bold text-white transition-all shadow-md bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
            >
                {isCalculating ? (
                    <div className="flex items-center space-x-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Traversing Flight Graph...</span>
                    </div>
                ) : (
                    <div className="flex items-center space-x-2 text-lg">
                        <IoPlayOutline />
                        <span>Find Optimal Route</span>
                    </div>
                )}
            </button>
        </div>
    );
};

export default FlightSearchBox;
