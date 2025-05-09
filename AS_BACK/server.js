const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');  // Correct path to db.js
const employeeRoutes = require('./routes/employeeRoutes');

dotenv.config(); // Load environment variables

const app = express();

// Connect to MongoDB
connectDB();

// Middleware for parsing JSON
app.use(express.json());

// Routes
app.use('/api', employeeRoutes);

// Start the server
app.listen(5000, () => {
    console.log('Server running on port 5000');
});
