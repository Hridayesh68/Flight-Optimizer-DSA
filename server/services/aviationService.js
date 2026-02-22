const axios = require('axios');

// Simple in-memory cache
const cache = new Map();
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes

const getFromCache = (key) => {
    const cached = cache.get(key);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        return cached.data;
    }
    return null;
};

const setInCache = (key, data) => {
    cache.set(key, {
        data,
        timestamp: Date.now()
    });
};

const fetchData = async (endpoint, params = {}) => {
    const API_KEY = process.env.AVIATIONSTACK_API_KEY || process.env.AviationStack_API;
    const BASE_URL = 'http://api.aviationstack.com/v1';

    if (!API_KEY) {
        throw new Error('AviationStack API key is missing. Please set AVIATIONSTACK_API_KEY in .env');
    }

    // Construct cache key based on endpoint and params
    const cacheKey = `${endpoint}_${JSON.stringify(params)}`;
    const cachedData = getFromCache(cacheKey);

    if (cachedData) {
        console.log(`[Cache Hit] ${endpoint}`);
        return cachedData;
    }

    try {
        console.log(`[API Call] ${endpoint}`);
        const response = await axios.get(`${BASE_URL}/${endpoint}`, {
            params: {
                access_key: API_KEY,
                ...params
            }
        });

        if (response.data && response.data.error) {
            throw new Error(`AviationStack API Error: ${response.data.error.message || response.data.error.code}`);
        }

        if (!response.data || !response.data.data) {
            throw new Error('Invalid response from AviationStack API');
        }

        setInCache(cacheKey, response.data);
        return response.data;

    } catch (error) {
        if (error.response) {
            throw new Error(`AviationStack API HTTP Error: ${error.response.status} - ${JSON.stringify(error.response.data)}`);
        } else if (error.request) {
            throw new Error('No response from AviationStack API');
        } else {
            throw error;
        }
    }
};

const aviationService = {
    getAirports: async (params = {}) => {
        return fetchData('airports', params);
    },

    getRoutes: async (params = {}) => {
        return fetchData('routes', params);
    },

    getFlights: async (params = {}) => {
        return fetchData('flights', params);
    },

    getAirlines: async (params = {}) => {
        return fetchData('airlines', params);
    }
};

module.exports = aviationService;
