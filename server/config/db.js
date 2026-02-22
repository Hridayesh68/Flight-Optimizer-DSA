const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // Replace with your MongoDB URI
        // For now we'll use a local instance or a placeholder
        const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/road-trip-optimizer', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (err) {
        console.error(`Error: ${err.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;
