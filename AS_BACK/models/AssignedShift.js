const mongoose = require('mongoose');

const assignedShiftSchema = new mongoose.Schema({
    employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
    shiftId: { type: mongoose.Schema.Types.ObjectId, ref: 'Shift', required: true },
    date: { type: Date, required: true },
});

module.exports = mongoose.model('AssignedShift', assignedShiftSchema);
