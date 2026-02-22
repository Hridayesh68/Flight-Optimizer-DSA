import axios from 'axios';

const API_URL = 'http://localhost:5000/api/attractions';

const getAttractions = async (city, category, minRating) => {
    let url = `${API_URL}/${city}?`;

    if (category) url += `category=${category}&`;
    if (minRating) url += `minRating=${minRating}`;

    const response = await axios.get(url);
    return response.data;
};

const attractionService = {
    getAttractions,
};

export default attractionService;
