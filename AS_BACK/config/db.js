const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const mongoURI = process.env.MONGO_URI; // Mongo URI from .env
        if (!mongoURI) {
            throw new Error('Mongo URI is not defined');
        }

        await mongoose.connect(mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log('MongoDB connected');
    } catch (error) {
        console.error('DB Connection Error:', error);
        process.exit(1);  // Exit the process if connection fails
    }
};

module.exports = connectDB;
