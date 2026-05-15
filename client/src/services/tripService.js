import api from './api';

const API_URL = '/trips';

const optimizeTrip = async (cities) => {
    const response = await api.post(`${API_URL}/optimize`, { cities });
    return response.data;
};

const saveTrip = async (tripData) => {
    const response = await api.post(API_URL, tripData);
    return response.data;
};

const getSavedTrips = async () => {
    const response = await api.get(API_URL);
    return response.data;
};

const tripService = {
    optimizeTrip,
    saveTrip,
    getSavedTrips
};

export default tripService;
