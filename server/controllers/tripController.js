const Trip = require('../models/Trip');

// @desc    Save a flight route
// @route   POST /api/trips
// @access  Private
const saveTrip = async (req, res) => {
    try {
        const { origin, destination, algorithm, optimizedBy, metrics, path } = req.body;

        if (!origin || !destination || !algorithm || !path) {
            return res.status(400).json({ message: 'Missing required trip data' });
        }

        // Check for duplicates
        const existingTrip = await Trip.findOne({
            user: req.user._id,
            origin,
            destination,
            algorithm
        });

        if (existingTrip) {
            return res.status(409).json({ message: 'This specific flight route and algorithm combination is already saved.' });
        }

        const trip = await Trip.create({
            user: req.user._id,
            origin,
            destination,
            algorithm,
            optimizedBy,
            metrics,
            path
        });

        res.status(201).json(trip);
    } catch (error) {
        console.error('Error saving trip:', error);
        res.status(500).json({ message: 'Server error saving trip', error: error.message });
    }
};

// @desc    Get user's saved flight routes
// @route   GET /api/trips
// @access  Private
const getSavedTrips = async (req, res) => {
    try {
        const trips = await Trip.find({ user: req.user._id }).sort({ savedAt: -1 });
        res.status(200).json(trips);
    } catch (error) {
        console.error('Error fetching saved trips:', error);
        res.status(500).json({ message: 'Server error fetching trips', error: error.message });
    }
};

module.exports = {
    saveTrip,
    getSavedTrips
};
