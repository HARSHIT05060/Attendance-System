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

module.exports = {
    getAllEmployees,
    getEmployeeById
};
