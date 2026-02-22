import React from 'react';

const HotelCard = ({ hotel, onBook }) => {
    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col h-full border hover:shadow-lg transition-shadow">
            <div className="h-40 bg-gray-300 relative">
                {/* Placeholder Image */}
                <img
                    src={`https://source.unsplash.com/random/400x300?hotel,${hotel.city}`}
                    alt={hotel.name}
                    className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded">
                    {hotel.rating} ★
                </div>
            </div>

            <div className="p-4 flex flex-col flex-grow">
                <h3 className="font-bold text-lg mb-1">{hotel.name}</h3>
                <p className="text-gray-500 text-sm mb-2">{hotel.city}</p>

                <div className="flex flex-wrap gap-1 mb-3">
                    {hotel.amenities.slice(0, 3).map((amenity, idx) => (
                        <span key={idx} className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                            {amenity}
                        </span>
                    ))}
                </div>

                <div className="mt-auto flex justify-between items-center">
                    <div>
                        <span className="text-xl font-bold text-green-600">₹{hotel.price}</span>
                        <span className="text-gray-400 text-xs">/night</span>
                    </div>
                    <button
                        onClick={() => onBook(hotel)}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                    >
                        Book
                    </button>
                </div>
            </div>
        </div>
    );
};

export default HotelCard;
