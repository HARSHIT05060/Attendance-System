const mongoose = require('mongoose');

const assignedShiftSchema = new mongoose.Schema({
    employeeCode: { type: String, required: true },
    shiftId: { type: mongoose.Schema.Types.ObjectId, ref: 'Shift', required: true },
    date: { type: Date, required: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('AssignedShift', assignedShiftSchema);
