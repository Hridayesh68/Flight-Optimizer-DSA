import { createContext, useState } from 'react';

export const TripContext = createContext();

export const TripProvider = ({ children }) => {
    const [selectedCities, setSelectedCities] = useState([]);
    const [optimizedRoute, setOptimizedRoute] = useState(null);
    const [totalDistance, setTotalDistance] = useState(0);
    const [visualizedRoute, setVisualizedRoute] = useState(null);
    const [algorithmMetrics, setAlgorithmMetrics] = useState(null);

    const addCity = (city) => {
        if (!selectedCities.find(c => c.name === city.name)) {
            setSelectedCities([...selectedCities, city]);
        }
    };

    const removeCity = (cityName) => {
        setSelectedCities(selectedCities.filter(c => c.name !== cityName));
    };

    const clearTrip = () => {
        setSelectedCities([]);
        setOptimizedRoute(null);
        setTotalDistance(0);
        setVisualizedRoute(null);
        setAlgorithmMetrics(null);
    };

    return (
        <TripContext.Provider value={{
            selectedCities,
            setSelectedCities,
            addCity,
            removeCity,
            optimizedRoute,
            setOptimizedRoute,
            totalDistance,
            setTotalDistance,
            visualizedRoute,
            setVisualizedRoute,
            algorithmMetrics,
            setAlgorithmMetrics,
            clearTrip
        }}>
            {children}
        </TripContext.Provider>
    );
};
