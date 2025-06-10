// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    employeeCode: {
        type: String,
        ref: 'Employee',
        required: true,
        unique: true
    },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // Store hashed passwords
    role: {
        type: String,
        enum: ['Admin', 'HR', 'Manager', 'Employee'],
        default: 'Employee'
    },
    permissions: {
        canApproveLeave: { type: Boolean, default: false },
        canEditSalary: { type: Boolean, default: false },
        canAccessPayroll: { type: Boolean, default: false },
        canManageUsers: { type: Boolean, default: false }
    },
    status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
    lastLogin: { type: Date },
    twoFactorEnabled: { type: Boolean, default: false }
});

module.exports = mongoose.model('User', userSchema);
