export const formatDistance = (distanceInKm) => {
    if (!distanceInKm) return '0 km';
    return `${distanceInKm.toLocaleString()} km`;
};

export const formatDuration = (distanceInKm) => {
    // Assuming an average speed of 60 km/h for a road trip
    const hours = Math.floor(distanceInKm / 60);
    const minutes = Math.round((distanceInKm % 60) * (60 / 60)); // remaining km mapped to minutes roughly

    if (hours === 0) return `${minutes} mins`;
    return `${hours} hr ${minutes} mins`;
};
