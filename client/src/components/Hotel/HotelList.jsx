import React, { useState, useEffect } from 'react';
import hotelService from '../../services/hotelService';
import HotelCard from './HotelCard';

const HotelList = ({ city, onBookHotel }) => {
    const [hotels, setHotels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sortBy, setSortBy] = useState('');

    useEffect(() => {
        const fetchHotels = async () => {
            setLoading(true);
            try {
                const data = await hotelService.getHotels(city.name, sortBy);
                setHotels(data);
            } catch (error) {
                console.error("Error fetching hotels:", error);
            } finally {
                setLoading(false);
            }
        };

        if (city) {
            fetchHotels();
        }
    }, [city, sortBy]);

    return (
        <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Stays in {city.name}</h2>
                <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="border p-2 rounded bg-white shadow-sm"
                >
                    <option value="">Sort By</option>
                    <option value="price_asc">Price: Low to High</option>
                    <option value="price_desc">Price: High to Low</option>
                    <option value="rating_desc">Rating: High to Low</option>
                </select>
            </div>

            {loading ? (
                <div className="flex justify-center p-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
            ) : hotels.length === 0 ? (
                <p className="text-gray-500">No hotels found in this city.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {hotels.map(hotel => (
                        <HotelCard key={hotel._id} hotel={hotel} onBook={onBookHotel} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default HotelList;
