import { useState, useEffect } from 'react';
import attractionService from '../../services/attractionService';
import AttractionCard from './AttractionCard';
import { IoAlertCircleOutline } from 'react-icons/io5';

const AttractionList = ({ city, categoryFilter, minRatingFilter }) => {
    const [attractions, setAttractions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchAttractions = async () => {
            setLoading(true);
            try {
                const data = await attractionService.getAttractions(city.name, categoryFilter, minRatingFilter);
                setAttractions(data);
                setError('');
            } catch (err) {
                console.error("Error fetching attractions:", err);
                setError('Failed to load attractions for this city.');
            } finally {
                setLoading(false);
            }
        };

        if (city && city.name) {
            fetchAttractions();
        }
    }, [city, categoryFilter, minRatingFilter]);

    if (!city) return null;

    return (
        <div className="mt-4">
            {loading ? (
                <div className="flex justify-center p-8">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-600"></div>
                </div>
            ) : error ? (
                <div className="bg-red-50 text-red-600 p-4 rounded-lg flex items-center">
                    <IoAlertCircleOutline className="mr-2 text-xl" /> {error}
                </div>
            ) : attractions.length === 0 ? (
                <p className="text-gray-500 italic p-4 bg-gray-50 rounded-lg text-center">
                    No attractions found matching these filters in {city.name}.
                </p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {attractions.map(attraction => (
                        <AttractionCard key={attraction._id} attraction={attraction} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default AttractionList;
