const fs = require('fs');
const path = require('path');

const airports = JSON.parse(fs.readFileSync('./server/data/airports.json', 'utf8'));
const flights = JSON.parse(fs.readFileSync('./server/data/flights.json', 'utf8'));

const graph = new Map();
airports.forEach(a => graph.set(a.code, []));

flights.forEach(f => {
    if (graph.has(f.source) && graph.has(f.target)) {
        graph.get(f.source).push(f.target);
        graph.get(f.target).push(f.source); // undirected
    }
});

function hasPath(start, end) {
    const visited = new Set();
    const queue = [start];
    while (queue.length > 0) {
        const node = queue.shift();
        if (node === end) return true;
        if (visited.has(node)) continue;
        visited.add(node);
        const neighbors = graph.get(node) || [];
        queue.push(...neighbors);
    }
    return false;
}

console.log('Path DEL to JFK:', hasPath('DEL', 'JFK'));
console.log('Total nodes in graph:', graph.size);
console.log('Total edges in graph:', flights.length * 2);
