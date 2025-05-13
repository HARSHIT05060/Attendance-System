const express = require('express');
const router = express.Router();
const { createUser, getUsers, updateUser, deleteUser } = require('../controllers/userController');

// Create a new user
router.post('/create', createUser);

// Get all users
router.get('/', getUsers);

// Update user by ID
router.put('/:id', updateUser);

// Delete user by ID
router.delete('/:id', deleteUser);

module.exports = router;
