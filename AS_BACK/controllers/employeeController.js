const Employee = require('../models/Employee');

// Get all employees (summary)
const getAllEmployees = async (req, res) => {
    try {
        const employees = await Employee.find({}, 'fullName employeeId email phoneNumber designation department salary status shift biometricFaceRecognition biometricFingerprint photo'); // Specify the fields to return
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

        res.json({
            _id: employee._id,
            fullName: employee.fullName,
            employeeId: employee.employeeId,
            email: employee.email,
            phoneNumber: employee.phoneNumber,
            designation: employee.designation,
            department: employee.department,
            salary: employee.salary,
            joiningDate: employee.joiningDate,
            bankAccountDetails: employee.bankAccountDetails,
            status: employee.status,
            shift: employee.shift,
            biometricFaceRecognition: employee.biometricFaceRecognition,
            biometricFingerprint: employee.biometricFingerprint,
            photo: employee.photo
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

// Update an employee by ID
const updateEmployee = async (req, res) => {
    const { id } = req.params;               // Extract employee ID from request params
    const updatedEmployee = req.body;        // Get the updated employee data from the request body

    try {
        // Find the employee by ID and update with the new data
        const employee = await Employee.findByIdAndUpdate(id, updatedEmployee, { new: true });

        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' }); // Handle case if employee is not found
        }

        // Return the updated employee data as the response
        res.json(employee);
    } catch (error) {
        console.error('Error updating employee:', error);
        res.status(500).json({ message: 'Failed to update employee data' }); // Handle internal server errors
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


// create a new employee
const createEmployee = async (req, res) => {
    try {
        const newEmployee = new Employee(req.body);
        const savedEmployee = await newEmployee.save();
        res.status(201).json(savedEmployee);
    } catch (error) {
        console.error('Error creating employee:', error);
        res.status(500).json({ message: 'Failed to create employee' });
    }
};

module.exports = {
    getAllEmployees,
    getEmployeeById,
    updateEmployee,
    deleteEmployee,
    createEmployee
};
