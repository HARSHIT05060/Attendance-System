const mongoose = require('mongoose');

const shiftSchema = new mongoose.Schema({
    name: { type: String, required: true }, // e.g., Morning, Night
    startTime: { type: String, required: true }, // "09:00"
    endTime: { type: String, required: true },   // "17:00"
    breakDuration: { type: Number, default: 0 }, // in minutes
    daysApplicable: [{ type: Number }],          // [1,2,3,4,5]
});

module.exports = mongoose.model('Shift', shiftSchema);
