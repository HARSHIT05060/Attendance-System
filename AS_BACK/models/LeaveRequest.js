const mongoose = require('mongoose');

const leaveRequestSchema = new mongoose.Schema({
    employee_id: { type: String, required: true },
    employee_name: { type: String, required: true },
    leave_type: { type: String, required: true },
    start_date: { type: Date, required: true },
    end_date: { type: Date, required: true },
    status: { type: String, default: 'Pending' },
    reason: { type: String, required: true }
});

const LeaveRequest = mongoose.model('leaverequests', leaveRequestSchema);

module.exports = LeaveRequest;
