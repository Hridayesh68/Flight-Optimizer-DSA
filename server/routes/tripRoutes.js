const express = require('express');
const router = express.Router();
const { saveTrip, getSavedTrips } = require('../controllers/tripController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
    .post(protect, saveTrip)
    .get(protect, getSavedTrips);

module.exports = router;
