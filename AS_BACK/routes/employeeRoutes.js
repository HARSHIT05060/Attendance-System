const express = require('express');
const router = express.Router();
const { getAllEmployees, getEmployeeById, updateEmployee, deleteEmployee, createEmployee } = require('../controllers/employeeController');

// Route for getting all employees
router.get('/employees', getAllEmployees);

// Route for getting a single employee by ID
router.get('/employees/:id', getEmployeeById);

// Route for updating employee data by ID
router.put('/employees/:id', updateEmployee);

// Route for Delete employee data by ID
router.delete('/employees/:id', deleteEmployee);

// Route for creating a new employee
router.post('/employees', createEmployee);

module.exports = router;
