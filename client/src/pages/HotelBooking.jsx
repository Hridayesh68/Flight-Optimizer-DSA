import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import HotelList from '../components/Hotel/HotelList';
import BookingForm from '../components/Hotel/BookingForm';

const HotelBooking = () => {
    const location = useLocation();
    const navigate = useNavigate();
    // Default to Mumbai/Pune if no state passed (dev mode fallback)
    const route = location.state?.route || [{ name: 'Mumbai' }, { name: 'Pune' }];

    const [selectedHotel, setSelectedHotel] = useState(null);

    const handleBookHotel = (hotel) => {
        // In real app, check for auth here
        setSelectedHotel(hotel);
    };

    const handleCloseBooking = () => {
        setSelectedHotel(null);
    };

    const handleConfirmBooking = (bookingData) => {
        console.log("Booking Confirmed:", bookingData);
        alert(`Booking Confirmed for ${selectedHotel.name}!\nTotal: ₹${bookingData.totalCost}`);
        setSelectedHotel(null);
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <header className="mb-8 flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Book Your Stays</h1>
                    <p className="text-gray-600">Find the best hotels for your stops.</p>
                </div>
                <button
                    onClick={() => navigate('/plan-trip')}
                    className="text-blue-600 hover:underline"
                >
                    Back to Map
                </button>
            </header>

            <div className="max-w-7xl mx-auto">
                {route.map((city, index) => (
                    <HotelList
                        key={`${city.name}-${index}`}
                        city={city}
                        onBookHotel={handleBookHotel}
                    />
                ))}
            </div>

            {selectedHotel && (
                <BookingForm
                    hotel={selectedHotel}
                    onClose={handleCloseBooking}
                    onConfirm={handleConfirmBooking}
                />
            )}
        </div>
    );
};

export default HotelBooking;
