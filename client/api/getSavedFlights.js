import connectDB from './utils/db.js';
import Trip from './models/Trip.js';
import User from './models/User.js';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
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

        const trips = await Trip.find({ user: user._id }).sort({ savedAt: -1 });
        return res.status(200).json(trips);
    } catch (error) {
        console.error('Error fetching saved trips:', error);
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Not authorized, token failed' });
        }
        return res.status(500).json({ message: 'Server error fetching trips', error: error.message });
    }
}
