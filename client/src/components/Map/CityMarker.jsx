import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet's default icon path issues with React
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const CityMarker = ({ city, orderIndex, isVisualized, visualIndex }) => {
    return (
        <Marker position={[city.lat, city.lng]}>
            <Popup>
                <div className="font-sans">
                    <h3 className="font-bold text-lg m-0">{city.name}</h3>
                    {orderIndex !== undefined && !isVisualized && (
                        <p className="text-sm text-blue-600 m-0 font-semibold mb-1">
                            Stop {orderIndex + 1}
                        </p>
                    )}
                    {isVisualized && visualIndex !== -1 && (
                        <p className="text-sm text-purple-600 m-0 font-semibold mb-1">
                            Algorithm Visited #{visualIndex + 1}
                        </p>
                    )}
                    <p className="text-gray-500 text-xs m-0">Lat: {city.lat.toFixed(2)}, Lng: {city.lng.toFixed(2)}</p>
                </div>
            </Popup>
        </Marker>
    );
};

export default CityMarker;
