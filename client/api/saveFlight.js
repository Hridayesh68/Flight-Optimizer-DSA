import connectDB from './utils/db.js';
import Trip from './models/Trip.js';
import User from './models/User.js';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        await connectDB();

        // Inline Authentication
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Not authorized, no token' });
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_key');
        const user = await User.findById(decoded.id).select('-password');

        if (!user) {
            return res.status(401).json({ message: 'Not authorized, user not found' });
        }

        const { origin, destination, algorithm, optimizedBy, metrics, path } = req.body;

        if (!origin || !destination || !algorithm || !path) {
            return res.status(400).json({ message: 'Missing required trip data' });
        }

        // Check for duplicates
        const existingTrip = await Trip.findOne({
            user: user._id,
            origin,
            destination,
            algorithm
        });

        if (existingTrip) {
            return res.status(409).json({ message: 'This specific flight route and algorithm combination is already saved.' });
        }

        const trip = await Trip.create({
            user: user._id,
            origin,
            destination,
            algorithm,
            optimizedBy,
            metrics,
            path
        });

        return res.status(201).json(trip);
    } catch (error) {
        console.error('Error saving trip:', error);
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Not authorized, token failed' });
        }
        return res.status(500).json({ message: 'Server error saving trip', error: error.message });
    }
}
