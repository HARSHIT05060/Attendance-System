const express = require('express');
const router = express.Router();
const { getAllEmployees, getEmployeeById } = require('../controllers/employeeController');

// Route for getting all employees
router.get('/employees', getAllEmployees);

// Route for getting a single employee by ID
router.get('/employees/:id', getEmployeeById);

module.exports = router;
