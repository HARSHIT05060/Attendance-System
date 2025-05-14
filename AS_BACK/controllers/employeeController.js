const Employee = require('../models/Employee');
const nodemailer = require('nodemailer');
const generatePassword = require('generate-password');
const bcrypt = require('bcrypt');
require('dotenv').config();

// Email setup
const transporter = nodemailer.createTransport({
    service: process.env.SMTP_SERVICE,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

// Get all employees (summary)
const getAllEmployees = async (req, res) => {
    try {
        const employees = await Employee.find({}, 'photo fullName employeeId email phoneNumber joiningDate designation department salary status shift biometricFaceRecognition biometricFingerprint photo'); // Specify the fields to return
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
            personalEmail: employee.personalEmail,
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


// Create a new employee
const createEmployee = async (req, res) => {
    try {
        const {
            fullName,
            employeeId,
            personalEmail,
            phoneNumber,
            designation,
            department,
            salary,
            status,
            shift,
            bankAccountDetails,
            joiningDate,
            biometricFaceRecognition,
            biometricFingerprint,
            photo
        } = req.body;

        if (!fullName || !personalEmail) {
            return res.status(400).json({ message: 'Full name and personal email are required.' });
        }

        // 1) Company email
        const companyEmail = `ezee.${fullName.replace(/\s+/g, '').toLowerCase()}@gmail.com`;

        // 2) Generate & hash password
        const plainPassword = generatePassword.generate({
            length: 10,
            numbers: true,
            symbols: true,
            uppercase: true,
            lowercase: true,
            strict: true
        });
        const passwordHash = await bcrypt.hash(plainPassword, 10);

        // 3) Create and save Employee
        const newEmployee = new Employee({
            fullName,
            employeeId,
            personalEmail,
            email: companyEmail,
            passwordHash,
            phoneNumber,
            designation,
            department,
            salary,
            status,
            shift,
            bankAccountDetails,
            joiningDate,
            biometricFaceRecognition,
            biometricFingerprint,
            photo
        });
        const savedEmployee = await newEmployee.save();

        // 4) Send credentials to personal email
        const mailOptions = {
            from: 'yourcompany@gmail.com',
            to: personalEmail,
            subject: 'Welcome to Ezee – Your Account Credentials',
            html: `
        <p>Hello ${fullName},</p>
        <p>Your Ezee account has been created. Here are your login details:</p>
        <ul>
          <li><strong>Company Email:</strong> ${companyEmail}</li>
          <li><strong>Password:</strong> ${plainPassword}</li>
        </ul>
        <p>Please log in at <a href="https://yourcompany.com/login">https://yourcompany.com/login</a> and change your password immediately.</p>
        <p>Regards,<br/>Ezee HR Team</p>
      `
        };
        await transporter.sendMail(mailOptions);

        // 5) Respond
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
