import flightGraph from '../algorithms/buildFlightGraph.js';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        await flightGraph.buildGraph();
        const nodes = Array.from(flightGraph.nodes.values());
        nodes.sort((a, b) => (a.city || a.name).localeCompare(b.city || b.name));
        return res.status(200).json(nodes);
    } catch (error) {
        console.error("Graph Error:", error)
        return res.status(500).json({ message: 'Failed to fetch graph airports', error: error.message });
    }
}
