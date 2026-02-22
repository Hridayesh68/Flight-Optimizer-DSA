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

    // Flatten all nodes so we can drop a Marker on each unique airport visited in any algorithm
    const uniqueAirportsMap = new Map();
    if (isShowingRoute) {
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

    return (
        <MapContainer center={center} zoom={zoom} scrollWheelZoom={true} className="h-full w-full rounded-lg z-0">
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            />

            {/* Render all unique airports in the current routing queries */}
            {isShowingRoute && uniqueAirports.map((apt, index) => (
                <Marker key={`marker-${apt.code}`} position={[apt.lat, apt.lng]}>
                    <Popup>
                        <div className="font-sans">
                            <h3 className="font-bold text-lg m-0">{apt.city} ({apt.code})</h3>
                            <p className="text-gray-500 text-xs m-0 mt-1">{apt.name}</p>
                        </div>
                    </Popup>
                </Marker>
            ))}

            {/* Direct straight-line Flight Path for each Algorithm */}
            {isShowingRoute && visualizedRoute.map((routeObj, i) => {
                if (!routeObj || !Array.isArray(routeObj.path)) return null;
                return (
                    <Polyline
                        key={`poly-${routeObj.type}-${i}`}
                        positions={routeObj.path.filter(apt => apt && apt.lat && apt.lng).map(apt => [apt.lat, apt.lng])}
                        color={typeColors[routeObj.type] || '#3b82f6'}
                        weight={4}
                        opacity={0.8}
                    />
                );
            })}

            {/* Dynamic Bounds Zooming */}
            <FitBounds routes={visualizedRoute} />
        </MapContainer>
    );
};

export default FlightMap;
