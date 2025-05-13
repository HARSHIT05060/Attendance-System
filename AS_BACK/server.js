const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');  // Correct path to db.js
const employeeRoutes = require('./routes/employeeRoutes'); // Correct path to employeeRoutes.js
const leaveRoutes = require('./routes/leaveRoutes');
const userRoutes = require('./routes/userRoutes');

dotenv.config(); // Load environment variables

const app = express();

app.use(express.json());
// Enable CORS for frontend communication
app.use(cors({
    origin: 'http://localhost:5173',  // URL of your frontend
}));

// Connect to MongoDB
connectDB();

app.use('/api/users', userRoutes);


// Middleware to parse JSON request bodies
app.use(express.json());

// Use employee routes
app.use('/api', employeeRoutes);

// Use leave routes
app.use('/api', leaveRoutes);

app.use('/api/leaves', leaveRoutes);

// Start the server
app.listen(5000, () => {
    console.log('Server running on port 5000');
});
