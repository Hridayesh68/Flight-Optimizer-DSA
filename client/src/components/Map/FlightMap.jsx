import React, { useContext, useEffect } from 'react';
import { MapContainer, TileLayer, Popup, Marker, Polyline, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { TripContext } from '../../context/TripContext';

// Fix for default marker icon not showing
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Helper component to adjust bounds of the map dynamically
function FitBounds({ routes }) {
    const map = useMap();

    useEffect(() => {
        if (!routes || routes.length === 0) return;

        // Extract valid coordinates from all routes
        const allCoords = [];
        routes.forEach(routeObj => {
            if (routeObj && Array.isArray(routeObj.path)) {
                routeObj.path.forEach(c => {
                    if (c && c.lat && c.lng && !isNaN(c.lat) && !isNaN(c.lng)) {
                        allCoords.push([c.lat, c.lng]);
                    }
                });
            }
        });

        if (allCoords.length > 0) {
            const bounds = L.latLngBounds(allCoords);
            map.fitBounds(bounds, { padding: [50, 50], maxZoom: 6 });
        }
    }, [routes, map]);

    return null;
}

const FlightMap = () => {
    // Default center (Global View)
    const center = [20, 0];
    const zoom = 2;
    const { visualizedRoute } = useContext(TripContext);

    // Determine visual styling based on algorithm type
    const isShowingRoute = !!visualizedRoute && visualizedRoute.length > 0;

    const typeColors = {
        bfs: '#f97316',    // Orange
        dfs: '#9ca3af',    // Gray
        dijkstra: '#3b82f6', // Blue
        astar: '#22c55e'   // Green
    };

    let originCode = null;
    let destCode = null;

    // Flatten all nodes so we can drop a Marker on each unique airport visited in any algorithm
    const uniqueAirportsMap = new Map();
    if (isShowingRoute) {
        const firstRoute = visualizedRoute[0];
        if (firstRoute && firstRoute.path && firstRoute.path.length > 0) {
            originCode = firstRoute.path[0].code;
            destCode = firstRoute.path[firstRoute.path.length - 1].code;
        }

        visualizedRoute.forEach(routeObj => {
            if (routeObj && Array.isArray(routeObj.path)) {
                routeObj.path.forEach(apt => {
                    if (apt && apt.code && !uniqueAirportsMap.has(apt.code)) {
                        uniqueAirportsMap.set(apt.code, apt);
                    }
                });
            }
        });
    }
    const uniqueAirports = Array.from(uniqueAirportsMap.values());

    const getAlgorithmPrefix = (type) => {
        switch (type) {
            case 'dijkstra': return 'DJ';
            case 'bfs': return 'BFS';
            case 'dfs': return 'DFS';
            case 'astar': return 'AST';
            default: return 'RTE';
        }
    };

    const getAlgorithmDetails = (type) => {
        switch (type) {
            case 'dijkstra':
                return { name: "Dijkstra", desc: "Finds shortest weighted path between nodes.", time: "O(E + V log V)", use: "Best for weighted graphs with no negative edges." };
            case 'bfs':
                return { name: "Breadth First Search", desc: "Explores neighbors level by level.", time: "O(V + E)", use: "Best for unweighted graphs to find minimum layovers." };
            case 'dfs':
                return { name: "Depth First Search", desc: "Explores as far as possible along each branch.", time: "O(V + E)", use: "Best for finding any available path quickly." };
            case 'astar':
                return { name: "A* Algorithm", desc: "Uses heuristics to guide the search towards the target.", time: "O(E)", use: "Best for spatial graphs offering faster targeted routing." };
            default:
                return { name: type, desc: "", time: "", use: "" };
        }
    };

    const greenIconUrl = 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png';
    const redIconUrl = 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png';

    const OriginIcon = L.icon({
        iconUrl: greenIconUrl,
        shadowUrl: iconShadow,
        iconSize: [25, 41],
        iconAnchor: [12, 41]
    });

    const DestIcon = L.icon({
        iconUrl: redIconUrl,
        shadowUrl: iconShadow,
        iconSize: [25, 41],
        iconAnchor: [12, 41]
    });

    // Custom helper to generate an algorithm labeled map pin using divIcon
    const createCustomDivIcon = (prefix, colorClass) => {
        return L.divIcon({
            className: 'custom-div-icon',
            html: `<div style="background-color: white; border: 2px solid ${colorClass}; color: ${colorClass}; font-weight: bold; border-radius: 4px; padding: 2px 4px; font-size: 10px; text-align: center; white-space: nowrap; box-shadow: 0 2px 4px rgba(0,0,0,0.2); transform: translate(-50%, -150%);">
                        ${prefix}
                   </div>`,
            iconSize: [0, 0],
            iconAnchor: [0, 0] // Anchor strictly to bottom center natively handled by CSS transform
        });
    };

    return (
        <MapContainer center={center} zoom={zoom} scrollWheelZoom={true} className="h-full w-full rounded-lg z-0">
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            />

            {/* Render all unique airports in the current routing queries */}
            {isShowingRoute && uniqueAirports.map((apt, index) => {
                let isOrigin = apt.code === originCode;
                let isDest = apt.code === destCode;

                // Which algorithms visit this airport?
                let algorithmsVisiting = [];
                visualizedRoute.forEach(routeObj => {
                    if (routeObj.path && routeObj.path.some(n => n.code === apt.code)) {
                        algorithmsVisiting.push(routeObj.type);
                    }
                });

                // Dedup
                algorithmsVisiting = [...new Set(algorithmsVisiting)];

                // Determine icon
                let markerIcon = null;
                if (isOrigin) {
                    markerIcon = createCustomDivIcon('O', '#22c55e');
                } else if (isDest) {
                    markerIcon = createCustomDivIcon('D', '#ef4444');
                } else if (algorithmsVisiting.length === 1) {
                    // Single algorithm layover
                    markerIcon = createCustomDivIcon(getAlgorithmPrefix(algorithmsVisiting[0]), typeColors[algorithmsVisiting[0]] || '#3b82f6');
                } else if (algorithmsVisiting.length > 1) {
                    // Multiple algorithms converge here
                    markerIcon = createCustomDivIcon('Multi', '#6b7280');
                } else {
                    markerIcon = DefaultIcon;
                }

                return (
                    <Marker key={`marker-${apt.code}`} position={[apt.lat, apt.lng]} icon={markerIcon}>
                        <Popup>
                            <div className="font-sans min-w-[200px]">
                                <h3 className="font-bold text-lg m-0">{apt.city} ({apt.code})</h3>
                                <p className="text-gray-500 text-xs m-0 mt-1 mb-2">{apt.name}</p>

                                {isOrigin && <p className="text-green-600 font-bold text-xs mt-1 mb-2">🟢 Origin</p>}
                                {isDest && <p className="text-red-600 font-bold text-xs mt-1 mb-2">🔴 Destination</p>}

                                {!isOrigin && !isDest && (
                                    <div className="border-t pt-2 mt-2">
                                        <p className="font-bold text-xs text-gray-700 mb-1">Visited by:</p>
                                        {algorithmsVisiting.map(alg => {
                                            const details = getAlgorithmDetails(alg);
                                            return (
                                                <div key={alg} className="mb-2">
                                                    <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-bold text-white mb-1" style={{ backgroundColor: typeColors[alg] || '#3b82f6' }}>
                                                        {getAlgorithmPrefix(alg)} - {details.name}
                                                    </span>
                                                    <div className="text-[10px] text-gray-600 leading-tight">
                                                        <i>{details.desc}</i><br />
                                                        <b>Time:</b> {details.time}<br />
                                                        <span className="text-gray-500">{details.use}</span>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </Popup>
                    </Marker>
                );
            })}

            {/* Direct straight-line Flight Path for each Algorithm */}
            {isShowingRoute && visualizedRoute.map((routeObj, i) => {
                if (!routeObj || !Array.isArray(routeObj.path)) return null;

                // Adjust weight and dash so overlapping paths are visible
                const weight = 6 - (i); // e.g., 6, 5, 4, 3
                const dashArray = i === 0 ? '' : i === 1 ? '10, 10' : i === 2 ? '5, 5' : '2, 5';

                return (
                    <Polyline
                        key={`poly-${routeObj.type}-${i}`}
                        positions={routeObj.path.filter(apt => apt && apt.lat && apt.lng).map(apt => [apt.lat, apt.lng])}
                        color={typeColors[routeObj.type] || '#3b82f6'}
                        weight={weight}
                        opacity={0.9}
                        dashArray={dashArray}
                    />
                );
            })}

            {/* Dynamic Bounds Zooming */}
            <FitBounds routes={visualizedRoute} />
        </MapContainer>
    );
};

export default FlightMap;
