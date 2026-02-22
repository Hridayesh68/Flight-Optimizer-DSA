import axios from 'axios';

const API_URL = 'http://localhost:5000/api/trips';

const optimizeTrip = async (cities) => {
    const response = await axios.post(`${API_URL}/optimize`, { cities });
    return response.data;
};

const tripService = {
    optimizeTrip,
};

export default tripService;
