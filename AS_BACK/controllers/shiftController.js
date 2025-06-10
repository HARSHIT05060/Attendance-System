const Shift = require('../models/Shift');
const AssignedShift = require('../models/AssignedShift');

// Create new shift type

exports.createShift = async (req, res) => {
    try {
        const { name, startTime, endTime } = req.body;

        if (!name || !startTime || !endTime) {
            return res.status(400).json({ message: 'Missing required fields: name, startTime, endTime' });
        }

        const shift = await Shift.create({ name, startTime, endTime });
        res.status(201).json(shift);
    } catch (error) {
        console.error("Error in createShift:", error);
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
        const { employeeCode, shiftId, date } = req.body;

        const existing = await AssignedShift.findOne({ employeeCode, date });
        if (existing) {
            return res.status(400).json({ message: "Shift already assigned for this date" });
        }

        const assigned = await AssignedShift.create({ employeeCode, shiftId, date });
        res.status(201).json(assigned);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get assigned shifts for an employee
exports.getAssignedShiftsForEmployee = async (req, res) => {
    try {
        const { employeeCode } = req.params;

        const shifts = await AssignedShift.find({ employeeCode })
            .populate('shiftId')
            .sort({ date: 1 });

        res.status(200).json(shifts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteShift = async (req, res) => {
    const { id } = req.params;

    try {
        const shift = await Shift.findById(id);

        if (!shift) {
            return res.status(404).json({ message: 'Shift not found' });
        }

        await shift.deleteOne();
        res.status(200).json({ message: 'Shift deleted successfully' });

    } catch (error) {
        console.error('Error deleting shift:', error);
        res.status(500).json({ message: 'Server error while deleting shift' });
    }
};

