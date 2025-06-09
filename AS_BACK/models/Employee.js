const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    employeeId: { type: String, required: true },
    email: { type: String, required: true, unique: true }, 
    personalEmail: { type: String, required: true, unique: true },
    phoneNumber: { type: String, required: true },
    designation: { type: String, required: true }, // dropdown
    department: { type: String, required: true }, //dropdown
    salary: { type: String, required: true },
    joiningDate: { type: Date, required: true },
    bankAccountDetails: { type: String, required: true },
    status: { type: String, required: true },
    shift: { type: String, required: true },
    biometricFaceRecognition: { type: String, default: null },
    biometricFingerprint: { type: String, default: null },
    photo: { type: String, default: null }
});

module.exports = mongoose.model('Employee', employeeSchema);


// // gender radio 
// // branch drop down

// // employeement type
// // salary type dropdown

// address
// bank details --> name, branch ,ifsc ,account number

// legal doc --> adhhar card ,pan card ,driving license ,passport photo

// contact infomation --> emergency contact number name relation address 

// personal information
// DOB

// reference --> name ,contact number ,remark

// attendence Permissions