const express = require('express');
const connectDB = require('./db');

const app = express();
const PORT = 3000;

// Connect to database
connectDB();

// Middleware
app.use(express.json());

// Routes (example)
app.get('/', (req, res) => {
    res.send('API is running...');
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
