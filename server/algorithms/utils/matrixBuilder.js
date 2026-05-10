const haversineDistance = require('./haversine');

/**
 * Builds a distance matrix for a list of locations.
 * @param {Array} locations - Array of objects with { id, lat, lng }
 * @returns {Array<Array<number>>} 2D array representing distances between locations
 */
function buildDistanceMatrix(locations) {
    const n = locations.length;
    const matrix = Array(n).fill(null).map(() => Array(n).fill(0));

    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            if (i === j) {
                matrix[i][j] = 0;
            } else {
                const dist = haversineDistance(
                    locations[i].lat, locations[i].lng,
                    locations[j].lat, locations[j].lng
                );
                matrix[i][j] = dist;
            }
        }
    }

    return matrix;
}

module.exports = buildDistanceMatrix;
