const Shift = require('../models/Shift');
const AssignedShift = require('../models/AssignedShift');

// Create new shift type
exports.createShift = async (req, res) => {
    try {
        const shift = await Shift.create(req.body);
        res.status(201).json(shift);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get all shifts
exports.getShifts = async (req, res) => {
    try {
        const shifts = await Shift.find();
        res.status(200).json(shifts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Assign shift to an employee for a specific date
exports.assignShiftToEmployee = async (req, res) => {
    try {
        const { employeeId, shiftId, date } = req.body;

        const existing = await AssignedShift.findOne({ employeeId, date });
        if (existing) {
            return res.status(400).json({ message: "Shift already assigned for this date" });
        }

        const assigned = await AssignedShift.create({ employeeId, shiftId, date });
        res.status(201).json(assigned);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get assigned shifts for an employee
exports.getAssignedShiftsForEmployee = async (req, res) => {
    try {
        const { employeeId } = req.params;

        const shifts = await AssignedShift.find({ employeeId })
            .populate('shiftId')
            .sort({ date: 1 });

        res.status(200).json(shifts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
