const User = require('../models/User');

// Create a new user
exports.createUser = async (req, res) => {
    try {
        const { employeeCode, username, password, role, permissions, status, lastLogin, twoFactorEnabled } = req.body;

        const newUser = new User({
            employeeCode,
            username,
            password,  // Ensure this is hashed before saving in a real-world scenario
            role,
            permissions,
            status,
            lastLogin,
            twoFactorEnabled
        });

        await newUser.save();
        res.status(201).json({ message: 'User created successfully', user: newUser });
    } catch (error) {
        res.status(500).json({ message: 'Error creating user', error });
    }
};

// Get all users
exports.getUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users', error });
    }
};

// Update user by ID
exports.updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedData = req.body;

        const updatedUser = await User.findByIdAndUpdate(id, updatedData, { new: true });
        res.status(200).json({ message: 'User updated successfully', user: updatedUser });
    } catch (error) {
        res.status(500).json({ message: 'Error updating user', error });
    }
};

// Delete user by ID
exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        await User.findByIdAndDelete(id);
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting user', error });
    }
};
