const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

const employeeRoutes = require('./routes/employeeRoutes');
const leaveRoutes = require('./routes/leaveRoutes');
const userRoutes = require('./routes/userRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const payrollRoutes = require('./routes/payrollRoutes');
const shiftRoutes = require('./routes/shiftRoutes');

// ⬇️ NEW: auth routes
const authRoutes = require('./routes/authRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Body parsers (JSON + URL-encoded, to support form submissions)
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

// CORS
app.use(cors({
    origin: [
        'http://localhost:5173',
        'https://attendance-system-sooty-gamma.vercel.app',
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    credentials: true,
}));

// DB
connectDB();

// Routes
app.use('/api/auth', authRoutes);          // ⬅️ NEW
app.use('/api/users', userRoutes);
app.use('/api', employeeRoutes);
app.use('/api', leaveRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/payroll', payrollRoutes);
app.use('/api', shiftRoutes);

app.get('/api/data', (req, res) => res.json({ message: 'Hello from backend!' }));
app.get('/', (req, res) => res.send('API is live 🚀'));

// Start
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
