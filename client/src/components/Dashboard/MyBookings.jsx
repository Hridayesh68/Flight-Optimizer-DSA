import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { IoBedOutline, IoCalendarOutline } from 'react-icons/io5';

const MyBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                const res = await axios.get('http://localhost:5000/api/bookings', config);
                setBookings(res.data);
            } catch (err) {
                console.error("Failed to fetch bookings", err);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchBookings();
        }
    }, [user]);

    if (loading) return <div className="p-8 text-center text-gray-500">Loading your bookings...</div>;

    if (bookings.length === 0) {
        return (
            <div className="bg-white p-8 rounded-xl shadow border border-gray-100 text-center">
                <IoBedOutline className="text-6xl text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-700 mb-2">No hotels booked yet</h3>
                <p className="text-gray-500">Book hotels at your trip stops to see them here.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 mt-12">
            <h2 className="text-2xl font-bold text-gray-800 border-t pt-8 mt-8">My Hotel Bookings</h2>
            <div className="space-y-4">
                {bookings.map(booking => (
                    <div key={booking._id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex flex-col sm:flex-row justify-between sm:items-center hover:shadow-md transition-shadow">
                        <div className="flex items-start">
                            <div className="bg-green-100 text-green-600 p-3 rounded-lg mr-4 mt-1">
                                <IoBedOutline className="text-xl" />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg text-gray-800">Hotel Booking #{booking._id.substring(booking._id.length - 6)}</h3>
                                <p className="text-gray-500 text-sm mt-1">Valid for stay at selected property.</p>

                                <div className="flex mt-3 space-x-6 text-sm">
                                    <div className="flex items-center text-gray-600">
                                        <IoCalendarOutline className="mr-1.5 text-blue-500" />
                                        In: <span className="font-semibold ml-1">{new Date(booking.checkIn).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex items-center text-gray-600">
                                        <IoCalendarOutline className="mr-1.5 text-red-500" />
                                        Out: <span className="font-semibold ml-1">{new Date(booking.checkOut).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-4 sm:mt-0 text-left sm:text-right border-t sm:border-t-0 pt-4 sm:pt-0">
                            <p className="text-gray-500 text-sm mb-1">Total Cost</p>
                            <p className="text-2xl font-bold text-green-600">₹{booking.totalCost}</p>
                            <span className="inline-block mt-2 px-3 py-1 bg-green-50 text-green-700 text-xs font-bold rounded-full border border-green-200 uppercase tracking-wider">
                                {booking.status}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MyBookings;
