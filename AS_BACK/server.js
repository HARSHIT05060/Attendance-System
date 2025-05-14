const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');  // Correct path to db.js
const employeeRoutes = require('./routes/employeeRoutes'); // Correct path to employeeRoutes.js
const leaveRoutes = require('./routes/leaveRoutes');
const userRoutes = require('./routes/userRoutes');

dotenv.config(); // Load environment variables

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware to parse JSON request bodies
app.use(express.json());

// Enable CORS for frontend communication
app.use(cors({
    origin: [
        'http://localhost:5173', // Vite dev server
        'https://attendance-system-sooty-gamma.vercel.app', // Your deployed frontend
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

// Connect to MongoDB
connectDB();

// Define your routes
app.use('/api/users', userRoutes);
app.use('/api', employeeRoutes);  // Employee routes
app.use('/api', leaveRoutes);     // Leave routes
app.get("/api/data", (req, res) => {
    res.json({ message: "Hello from backend!" });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
