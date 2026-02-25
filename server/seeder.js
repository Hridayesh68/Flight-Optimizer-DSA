const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

const seedData = async () => {
    await connectDB();

    try {
        console.log('No static seeded data remains. This application is now a dedicated Flight Route Optimizer.');
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

seedData();
