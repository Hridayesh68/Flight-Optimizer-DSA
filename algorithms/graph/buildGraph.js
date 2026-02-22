const buildDistanceMatrix = require('../utils/matrixBuilder');

/**
 * Builds a graph representation from a list of cities.
 * Uses an adjacency matrix where graph[i][j] is the distance between city i and city j.
 * @param {Array} cities - Array of city objects { id, name, lat, lng }
 * @returns {Object} Graph object containing matrix and city mapping
 */
function buildGraph(cities) {
    const matrix = buildDistanceMatrix(cities);
    return {
        nodes: cities,
        adjacencyMatrix: matrix
    };
}

module.exports = buildGraph;
