const Employee = require('../models/Employee');
require('dotenv').config();

// Create a new employee
const createEmployee = async (req, res) => {
    try {
        const {
            // Basic Details
            employeeCode,
            name,
            mobile,
            email,
            gender,
            branch,
            department,
            designation,
            employmentType,
            salaryType,
            salary,
            address,

            // Bank Details
            bankName,
            branchName,
            accountNo,
            ifscCode,

            // Legal Documents
            aadharCard,
            drivingLicence,
            panCard,
            photo,

            // Contact Information
            emergencyContactNo,
            contactPersonName,
            relation,
            emergencyAddress,

            // Personal Information
            dateOfBirth,
            dateOfJoining,

            // References
            references
        } = req.body;

        // Validation for required fields
        if (!employeeCode || !name || !mobile || !gender || !branch || !department || !designation) {
            return res.status(400).json({
                message: 'Employee Code, Name, Mobile, Gender, Branch, Department, and Designation are required.'
            });
        }

        // Check if employee code already exists
        const existingEmployee = await Employee.findOne({ employeeCode });
        if (existingEmployee) {
            return res.status(400).json({ message: 'Employee code already exists.' });
        }

        // Create new employee
        const newEmployee = new Employee({
            // Basic Details
            employeeCode,
            name,
            mobile,
            email, // personal email
            gender,
            branch,
            department,
            designation,
            employmentType,
            salaryType,
            salary,
            address,

            // Bank Details
            bankName,
            branchName,
            accountNo,
            ifscCode,

            // Legal Documents
            aadharCard,
            drivingLicence,
            panCard,
            photo,

            // Contact Information
            emergencyContactNo,
            contactPersonName,
            relation,
            emergencyAddress,

            // Personal Information
            dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
            dateOfJoining: dateOfJoining ? new Date(dateOfJoining) : null,

            // References
            references: references || [],

            // System fields
            status: 'active'
        });

        const savedEmployee = await newEmployee.save();

        res.status(201).json({
            message: 'Employee created successfully',
            employee: savedEmployee
        });

    } catch (error) {
        console.error('Error creating employee:', error);

        if (error.code === 11000) {
            // Duplicate key error
            const field = Object.keys(error.keyPattern)[0];
            return res.status(400).json({
                message: `${field} already exists. Please use a different value.`
            });
        }

        res.status(500).json({ message: 'Failed to create employee' });
    }
};

// Get all employees
const getAllEmployees = async (req, res) => {
    try {
        const employees = await Employee.find({},
            'photo name employeeCode email mobile dateOfJoining designation department salary status shift biometricFaceRecognition biometricFingerprint'
        );
        res.json(employees);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get employee by ID
const getEmployeeById = async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id);

        if (!employee) {
            return res.status(404).json({ message: "Employee not found" });
        }

        res.json(employee);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

// Update an employee by ID
const updateEmployee = async (req, res) => {
    const { id } = req.params;
    const updatedEmployee = req.body;

    try {
        const employee = await Employee.findByIdAndUpdate(id, updatedEmployee, {
            new: true,
            runValidators: true
        });

        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        res.json(employee);
    } catch (error) {
        console.error('Error updating employee:', error);
        res.status(500).json({ message: 'Failed to update employee data' });
    }
};

// Delete an employee by ID
const deleteEmployee = async (req, res) => {
    const { id } = req.params;

    try {
        const employee = await Employee.findByIdAndDelete(id);

        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        res.json({ message: 'Employee deleted successfully' });
    } catch (error) {
        console.error('Error deleting employee:', error);
        res.status(500).json({ message: 'Failed to delete employee' });
    }
};

module.exports = {
    getAllEmployees,
    getEmployeeById,
    updateEmployee,
    deleteEmployee,
    createEmployee
};