const mongoose = require('mongoose');

const payrollSchema = new mongoose.Schema({
    employeeId: { type: String, required: true },
    month: { type: String, required: true }, // Format: "2025-06"
    basicPay: { type: Number, required: true },
    bonuses: { type: Number, default: 0 },
    deductions: { type: Number, default: 0 },
    totalPay: { type: Number, required: true },
    status: { type: String, enum: ['pending', 'finalized'], default: 'pending' },
});

module.exports = mongoose.model('Payroll', payrollSchema);
