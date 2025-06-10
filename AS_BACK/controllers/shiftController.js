const Shift = require('../models/Shift');
const AssignedShift = require('../models/AssignedShift');
const Employee = require('../models/Employee');
// Create new shift type

const shortToDayNumber = {
    'Su': 0,
    'Mo': 1,
    'Tu': 2,
    'We': 3,
    'Th': 4,
    'Fr': 5,
    'Sa': 6,
};

exports.createShift = async (req, res) => {
    try {
        const { name, startTime, endTime, daysApplicable } = req.body;

        if (!name || !startTime || !endTime) {
            return res.status(400).json({ message: 'Missing required fields: name, startTime, endTime' });
        }

        const numericDaysApplicable = Array.isArray(daysApplicable)
            ? daysApplicable.map(day => shortToDayNumber[day])
            : [];

        const shift = await Shift.create({
            name,
            startTime,
            endTime,
            daysApplicable: numericDaysApplicable
        });

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


// Assign shift to employee and update employee's shift field
exports.assignShiftToEmployee = async (req, res) => {
    try {
        const { employeeId, shiftId, date } = req.body;

        if (!employeeId || !shiftId || !date) {
            return res.status(400).json({ message: "Missing required fields: employeeId, shiftId, or date" });
        }

        // const employee = await Employee.findOne({ employeeCode: employeeId });
        const employee = await Employee.findById(employeeId.trim());

        if (!employee) {
            return res.status(404).json({ message: "Employee not found" });
        }

        if (!employee) {
            return res.status(404).json({ message: "Employee not found" });
        }

        const shift = await Shift.findById(shiftId);
        if (!shift) {
            return res.status(404).json({ message: "Shift not found" });
        }

        // 1. Save shift name in Employee schema
        employee.shift = shift.name;
        await employee.save();

        // 2. Save assignment in AssignedShift collection
        const assignedShift = new AssignedShift({
            employeeCode: employeeId,
            shiftId: shift._id,
            date: new Date(date),
            createdAt: new Date()
        });

        await assignedShift.save();

        res.status(200).json({
            message: "Shift assigned to employee and recorded successfully",
            employee,
            assignedShift
        });

    } catch (error) {
        console.error("Error in assignShiftToEmployee:", error);
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

