import axios from 'axios';

const API_URL = '/api/';

const getAuthHeaders = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    return {
        headers: {
            Authorization: `Bearer ${user?.token}`,
        },
    };
};

// Deprecated in flight version but keeping signature
const optimizeTrip = async (cities) => {
    const response = await axios.post(`${API_URL}optimize`, { cities });
    return response.data;
};

const saveTrip = async (tripData) => {
    const response = await axios.post(`${API_URL}saveFlight`, tripData, getAuthHeaders());
    return response.data;
};

const getSavedTrips = async () => {
    const response = await axios.get(`${API_URL}getSavedFlights`, getAuthHeaders());
    return response.data;
};

const tripService = {
    optimizeTrip,
    saveTrip,
    getSavedTrips
};

export default tripService;
