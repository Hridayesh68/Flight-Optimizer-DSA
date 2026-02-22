import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { formatDistance } from '../../utils/distanceFormatter';
import { IoMapOutline, IoTimeOutline } from 'react-icons/io5';

const MyTrips = () => {
    const [trips, setTrips] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        const fetchTrips = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                const res = await axios.get('http://localhost:5000/api/trips', config);
                setTrips(res.data);
            } catch (err) {
                console.error("Failed to fetch trips", err);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchTrips();
        }
    }, [user]);

    if (loading) return <div className="p-8 text-center text-gray-500">Loading your trips...</div>;

    if (trips.length === 0) {
        return (
            <div className="bg-white p-8 rounded-xl shadow border border-gray-100 text-center">
                <IoMapOutline className="text-6xl text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-700 mb-2">No trips saved yet</h3>
                <p className="text-gray-500">Head over to the Trip Planner to start building your route.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">My Saved Trips</h2>
            <div className="grid gap-6 md:grid-cols-2">
                {trips.map(trip => (
                    <div key={trip._id} className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="font-bold text-lg text-blue-700">{trip.name || "Untitled Trip"}</h3>
                            <span className="bg-blue-50 text-blue-600 text-xs font-bold px-2 py-1 rounded-full border border-blue-200">
                                {new Date(trip.createdAt).toLocaleDateString()}
                            </span>
                        </div>

                        <div className="flex space-x-6 mb-4 text-sm text-gray-600">
                            <div className="flex items-center">
                                <IoMapOutline className="mr-1 text-gray-400" />
                                {trip.optimizedRoute.length} Stops
                            </div>
                            <div className="flex items-center">
                                <IoTimeOutline className="mr-1 text-gray-400" />
                                {formatDistance(trip.totalDistance)}
                            </div>
                        </div>

                        <div className="text-sm">
                            <h4 className="font-semibold text-gray-700 mb-2">Route:</h4>
                            <div className="flex flex-wrap gap-2">
                                {trip.optimizedRoute.map((city, idx) => (
                                    <span key={idx} className="bg-gray-100 text-gray-700 px-2 py-1 rounded-md text-xs">
                                        {idx + 1}. {city.name}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MyTrips;
