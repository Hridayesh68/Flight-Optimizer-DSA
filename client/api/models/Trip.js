import mongoose from 'mongoose';

const tripSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    origin: {
        code: { type: String, required: true },
        city: { type: String, required: true },
        name: { type: String }
    },
    destination: {
        code: { type: String, required: true },
        city: { type: String, required: true },
        name: { type: String }
    },
    algorithm: {
        type: String,
        required: true
    },
    optimizedBy: {
        type: String,
        default: 'distance'
    },
    metrics: {
        distance: { type: Number },
        time: { type: Number },
        cost: { type: Number },
        executionTimeMs: { type: Number },
        layovers: { type: Number }
    },
    path: [{
        code: String,
        name: String,
        city: String,
        lat: Number,
        lng: Number
    }],
    savedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

export default mongoose.models.Trip || mongoose.model('Trip', tripSchema);
