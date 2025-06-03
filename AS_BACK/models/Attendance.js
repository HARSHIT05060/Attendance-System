const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
    employeeId: { type: String, required: true },
    date: { type: String, required: true }, // Store as dd-mm-yyyy string
    status: { type: String, enum: ['present', 'absent', 'half-day', 'leave'], required: true },
});

attendanceSchema.index({ employeeId: 1, date: 1 }, { unique: true }); // Prevent duplicates for same day

module.exports = mongoose.model('Attendance', attendanceSchema);
