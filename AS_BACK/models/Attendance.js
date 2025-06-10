const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
    employeeCode: { type: String, required: true },
    date: { type: Date, required: true }, // Store as dd-mm-yyyy string
    status: {
        type: String, enum: [
            'full-day', 'half-day', 'paid-leave', 'sick-leave', 'work-from-home',
            'business-trip', 'holiday', 'leave', 'absent'
        ], required: true
    },
});

attendanceSchema.index({ employeeCode: 1, date: 1 }, { unique: true }); // Prevent duplicates for same day

module.exports = mongoose.model('Attendance', attendanceSchema);
