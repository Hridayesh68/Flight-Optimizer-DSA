import axios from 'axios';

const API_URL = 'http://localhost:5000/api/hotels';
const BOOKING_API_URL = 'http://localhost:5000/api/bookings';

const getHotels = async (city, sortBy) => {
    let url = `${API_URL}/${city}`;
    if (sortBy) {
        url += `?sortBy=${sortBy}`;
    }
    const response = await axios.get(url);
    return response.data;
};

const bookHotel = async (bookingData, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    const response = await axios.post(BOOKING_API_URL, bookingData, config);
    return response.data;
};

const hotelService = {
    getHotels,
    bookHotel,
};

export default hotelService;
