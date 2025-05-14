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


app.use(express.json());
// Enable CORS for frontend communication
app.use(cors({
    origin: 'https://attendance-system-sooty-gamma.vercel.app/api',  // URL of your frontend
    credentials: true
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
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
