const Shift = require('../models/Shift');
const AssignedShift = require('../models/AssignedShift');
const Employee = require('../models/Employee');

// Create new shift
exports.createShift = async (req, res) => {
    try {
        const { name, schedule, totalWeeklyHours, activeWorkingDays } = req.body;

        // Validation
        if (!name || !name.trim()) {
            return res.status(400).json({
                success: false,
                message: 'Please enter a shift name'
            });
        }

        if (!schedule) {
            return res.status(400).json({
                success: false,
                message: 'Schedule data is required'
            });
        }

        // Check for active working days
        const activeDays = Object.values(schedule).filter(day => day.isActive);

        if (activeDays.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Please set working hours for at least one day'
            });
        }

        // Validate each active day
        for (const [dayName, daySchedule] of Object.entries(schedule)) {
            if (daySchedule.isActive) {
                // Check required fields
                if (!daySchedule.fromHour || !daySchedule.toHour ||
                    !daySchedule.fromPeriod || !daySchedule.toPeriod) {
                    return res.status(400).json({
                        success: false,
                        message: `Please set complete working hours for ${dayName}`
                    });
                }

                // Validate time ranges
                const fromHour = parseInt(daySchedule.fromHour);
                const toHour = parseInt(daySchedule.toHour);

                if (fromHour < 1 || fromHour > 12 || toHour < 1 || toHour > 12) {
                    return res.status(400).json({
                        success: false,
                        message: `Invalid hours for ${dayName}`
                    });
                }
            }

            // Validate occasional working days if enabled
            if (daySchedule.isWeekOff && daySchedule.occasionalWorkingEnabled) {
                if (!daySchedule.occasionalWorkingWeeks || daySchedule.occasionalWorkingWeeks.length === 0) {
                    return res.status(400).json({
                        success: false,
                        message: `Please select at least one occasional working week for ${dayName}`
                    });
                }

                // Validate occasional working hours
                if (!daySchedule.occasionalFromHour || !daySchedule.occasionalToHour) {
                    return res.status(400).json({
                        success: false,
                        message: `Please set working hours for occasional ${dayName}`
                    });
                }
            }
        }

        // Create the shift
        const newShift = new Shift({
            name: name.trim(),
            schedule,
            totalWeeklyHours,
            activeWorkingDays: activeDays.length
        });

        const savedShift = await newShift.save();

        res.status(201).json({
            success: true,
            message: 'Shift created successfully',
            data: savedShift
        });

    } catch (error) {
        console.error('Error creating shift:', error);

        if (error.name === 'ValidationError') {
            return res.status(400).json({
                success: false,
                message: 'Validation error',
                errors: Object.values(error.errors).map(e => e.message)
            });
        }

        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// Get all shifts
exports.getShifts = async (req, res) => {
    try {
        const shifts = await Shift.find().sort({ createdAt: -1 });
        res.status(200).json(shifts);
    } catch (error) {
        console.error("Error in getShifts:", error);
        res.status(500).json({ error: error.message });
    }
};
exports.getEmployeesByShiftId = async (req, res) => {
    try {
        const { shiftId } = req.params;

        const employees = await Employee.find({ shift: shiftId });

        res.status(200).json(employees);
    } catch (error) {
        console.error("Error fetching employees by shift:", error);
        res.status(500).json({ message: "Failed to fetch employees" });
    }
};

// Assign shift to employee
exports.assignShiftToEmployee = async (req, res) => {
    try {
        const { employeeId, shiftId, date } = req.body;

        if (!employeeId || !shiftId || !date) {
            return res.status(400).json({ message: 'employeeId, shiftId, and date are required' });
        }

        const employee = await Employee.findById(employeeId.trim());
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        const shift = await Shift.findById(shiftId.trim());
        if (!shift) {
            return res.status(404).json({ message: 'Shift not found' });
        }

        // Update employee shift name
        // ✅ Correct line (assigning shift ObjectId)
        employee.shift = shift._id;

        await employee.save();

        // Save assignment
        const assignedShift = await AssignedShift.create({
            employeeCode: employeeId,
            shiftId: shift._id,
            date: new Date(date),
            createdAt: new Date()
        });

        res.status(200).json({
            message: 'Shift assigned successfully',
            employee,
            assignedShift
        });

    } catch (error) {
        console.error("Error in assignShiftToEmployee:", error);
        res.status(500).json({ error: error.message });
    }
};

// Get assigned shifts for employee
exports.getAssignedShiftsForEmployee = async (req, res) => {
    try {
        const { employeeCode } = req.params;

        const shifts = await AssignedShift.find({ employeeCode })
            .populate('shiftId')
            .sort({ date: 1 });

        res.status(200).json(shifts);
    } catch (error) {
        console.error("Error in getAssignedShiftsForEmployee:", error);
        res.status(500).json({ error: error.message });
    }
};

// Delete shift
exports.deleteShift = async (req, res) => {
    try {
        const { id } = req.params;
        const shift = await Shift.findById(id);

        if (!shift) {
            return res.status(404).json({ message: 'Shift not found' });
        }

        await shift.deleteOne();
        res.status(200).json({ message: 'Shift deleted successfully' });

    } catch (error) {
        console.error('Error in deleteShift:', error);
        res.status(500).json({ message: error.message || 'Server error while deleting shift' });
    }
};
const shortToDayNumber = {
    'Su': 0,
    'Mo': 1,
    'Tu': 2,
    'We': 3,
    'Th': 4,
    'Fr': 5,
    'Sa': 6,
};