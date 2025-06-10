const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
    // Basic Details
    employeeCode: { type: String, required: true, unique: true },
    name: { type: String, required: true }, // was fullName
    mobile: { type: String, required: true }, // was phoneNumber
    email: { type: String, required: false }, // personal email from frontend
    gender: { type: String, required: true },
    branch: { type: String, required: true },
    department: { type: String, required: true },
    designation: { type: String, required: true },
    employmentType: { type: String, required: false },
    salaryType: { type: String, required: false },
    salary: { type: String, required: false },
    address: { type: String, required: false },

    // Bank Details
    bankName: { type: String, required: false },
    branchName: { type: String, required: false },
    accountNo: { type: String, required: false },
    ifscCode: { type: String, required: false },

    // Legal Documents (store file paths or base64)
    aadharCard: { type: String, default: null },
    drivingLicence: { type: String, default: null },
    panCard: { type: String, default: null },
    photo: { type: String, default: null },

    // Contact Information
    emergencyContactNo: { type: String, required: false },
    contactPersonName: { type: String, required: false },
    relation: { type: String, required: false },
    emergencyAddress: { type: String, required: false },

    // Personal Information
    dateOfBirth: { type: Date, required: false },
    dateOfJoining: { type: Date, required: false },

    // References (array of objects)
    references: [{
        name: { type: String, required: false },
        contactNumber: { type: String, required: false }
    }],


    status: { type: String, default: 'active' },
    shift: { type: String, required: false },
    biometricFaceRecognition: { type: String, default: null },
    biometricFingerprint: { type: String, default: null }
}, {
    timestamps: true // adds createdAt and updatedAt
});

module.exports = mongoose.model('Employee', employeeSchema);