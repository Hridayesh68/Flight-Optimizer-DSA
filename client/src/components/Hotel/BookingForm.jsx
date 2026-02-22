import React, { useState } from 'react';

const BookingForm = ({ hotel, onClose, onConfirm }) => {
    const [checkIn, setCheckIn] = useState('');
    const [checkOut, setCheckOut] = useState('');
    const [guests, setGuests] = useState(1);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Calculate nights
        const start = new Date(checkIn);
        const end = new Date(checkOut);
        const diffTime = Math.abs(end - start);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        const totalCost = diffDays * hotel.price;

        onConfirm({
            hotelId: hotel._id,
            checkIn,
            checkOut,
            totalCost
        });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg max-w-md w-full">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold">Book {hotel.name}</h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Check-in</label>
                            <input
                                type="date"
                                required
                                className="w-full border p-2 rounded"
                                value={checkIn}
                                onChange={(e) => setCheckIn(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Check-out</label>
                            <input
                                type="date"
                                required
                                className="w-full border p-2 rounded"
                                value={checkOut}
                                min={checkIn}
                                onChange={(e) => setCheckOut(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-medium mb-1">Guests</label>
                        <select
                            className="w-full border p-2 rounded"
                            value={guests}
                            onChange={(e) => setGuests(e.target.value)}
                        >
                            <option value="1">1 Guest</option>
                            <option value="2">2 Guests</option>
                            <option value="3">3 Guests</option>
                            <option value="4">4 Guests</option>
                        </select>
                    </div>

                    <div className="border-t pt-4 mb-6">
                        <div className="flex justify-between mb-2">
                            <span>Price per night</span>
                            <span>₹{hotel.price}</span>
                        </div>
                        {checkIn && checkOut && (
                            <div className="flex justify-between font-bold text-lg">
                                <span>Total</span>
                                <span>
                                    ₹{Math.ceil(Math.abs(new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24)) * hotel.price}
                                </span>
                            </div>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={!checkIn || !checkOut}
                        className="w-full bg-blue-600 text-white py-2 rounded font-bold hover:bg-blue-700 disabled:bg-gray-300"
                    >
                        Confirm Booking
                    </button>
                </form>
            </div>
        </div>
    );
};

export default BookingForm;
