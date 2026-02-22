/**
 * Floyd-Warshall algorithm for all-pairs shortest paths.
 * @param {Array<Array<number>>} graph - Adjacency matrix
 * @returns {Array<Array<number>>} Matrix of shortest distances
 */
function floydWarshall(graph) {
    const dist = graph.map(row => [...row]);
    const n = graph.length;

    for (let k = 0; k < n; k++) {
        for (let i = 0; i < n; i++) {
            for (let j = 0; j < n; j++) {
                if (dist[i][k] + dist[k][j] < dist[i][j]) {
                    dist[i][j] = dist[i][k] + dist[k][j];
                }
            }
        }
    }

    return dist;
}

module.exports = floydWarshall;
