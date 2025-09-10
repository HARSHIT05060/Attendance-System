// controllers/authController.js
const User = require('../models/User');
const generateToken = require('../utils/generateToken');

exports.register = async (req, res) => {
    try {
        const { employeeCode, number, username, password, role } = req.body;

        if (!employeeCode || !password || (!number && !username)) {
            return res.status(400).json({
                success: false,
                message: 'employeeCode, password and at least one of number/username are required',
            });
        }

        // Enforce uniqueness if provided
        if (number) {
            const existsNumber = await User.findOne({ number });
            if (existsNumber) {
                return res.status(409).json({ success: false, message: 'Phone number already registered' });
            }
        }
        if (username) {
            const existsUsername = await User.findOne({ username });
            if (existsUsername) {
                return res.status(409).json({ success: false, message: 'Username already registered' });
            }
        }

        const user = await User.create({ employeeCode, number, username, password, role });

        const token = generateToken({
            id: user._id,
            number: user.number || null,
            username: user.username || null,
            role: user.role,
        });

        return res.json({
            success: true,
            token,
            user: {
                id: user._id,
                employeeCode: user.employeeCode,
                number: user.number || null,
                username: user.username || null,
                role: user.role,
            },
        });
    } catch (err) {
        console.error('Register error:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

exports.login = async (req, res) => {
    try {
        // UI sends { number, password }
        const { number, password } = req.body;

        if (!number || !password) {
            return res
                .status(400)
                .json({ success: false, message: 'number and password are required' });
        }

        // Find by phone number; fallback to username==number (legacy)
        const user = await User.findOne({
            $and: [
                { status: 'Active' },
                { $or: [{ number }, { username: number }] }
            ]
        });

        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        const ok = await user.comparePassword(password);
        if (!ok) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        user.lastLogin = new Date();
        await user.save();

        const token = generateToken({
            id: user._id,
            number: user.number || null,
            username: user.username || null,
            role: user.role,
        });

        return res.json({
            success: true,
            token,
            user: {
                id: user._id,
                employeeCode: user.employeeCode,
                number: user.number || null,
                username: user.username || null,
                role: user.role,
            },
        });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

exports.me = async (req, res) => {
    try {
        res.json({ success: true, user: req.user });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
