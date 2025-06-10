const Payroll = require('../models/Payroll');
const Attendance = require('../models/Attendance');
const Employee = require('../models/Employee');
const calculateMonthlyPayroll = require('../utils/calculateMonthlyPayroll');

exports.generatePayroll = async (req, res) => {
    const { month } = req.body;

    try {
        const employees = await Employee.find({});
        const payrolls = [];

        for (let emp of employees) {
            const { employeeCode, salary } = emp;
            const attendance = await Attendance.find({
                employeeCode,
                date: {
                    $gte: new Date(`${month}-01`),
                    $lte: new Date(`${month}-31`)
                }
            });

            const presentDays = attendance.filter(a => a.status === 'present').length;
            const basicPay = (parseFloat(salary) / 30) * presentDays;

            const payroll = new Payroll({
                employeeCode,
                month,
                basicPay,
                totalPay: basicPay,
                status: 'pending'
            });

            await payroll.save();
            payrolls.push(payroll);
        }

        res.status(200).json({ message: 'Payroll generated', data: payrolls });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.finalizePayroll = async (req, res) => {
    try {
        const payroll = await Payroll.findByIdAndUpdate(
            req.params.id,
            { status: 'finalized' },
            { new: true }
        );
        res.status(200).json({ message: 'Payroll finalized', data: payroll });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
const getSundays = (year, month) => {
    let count = 0;
    const date = new Date(year, month - 1, 1);
    const lastDay = new Date(year, month, 0).getDate(); // Last day of the month
    for (let day = 1; day <= lastDay; day++) {
        date.setDate(day);
        if (date.getDay() === 0) count++; // Sunday is 0
    }
    return count;
};

exports.getMonthlyPayroll = async (req, res) => {
    try {
        const { employeeCode, year, month } = req.query;

        if (!employeeCode || !year || !month) {
            return res.status(400).json({ message: 'employeeCode, year, and month are required' });
        }

        const employee = await Employee.findOne({ employeeCode });
        if (!employee) return res.status(404).json({ message: 'Employee not found' });

        const salary = parseFloat(employee.salary);
        const monthNum = parseInt(month, 10);
        const yearNum = parseInt(year, 10);

        const startDate = new Date(yearNum, monthNum - 1, 1);
        const lastDayOfMonth = new Date(yearNum, monthNum, 0).getDate();

        // Get total Sundays in month
        const sundays = getSundays(yearNum, monthNum);
        const totalWorkingDays = lastDayOfMonth - sundays;

        const attendanceRecords = await Attendance.find({
            employeeCode,
            date: {
                $gte: startDate.toISOString().slice(0, 10),
                $lte: new Date(yearNum, monthNum - 1, lastDayOfMonth).toISOString().slice(0, 10),
            },
        });

        const statusToPay = {
            'full-day': 1,
            'half-day': 0.5,
            'paid-leave': 1,
            'sick-leave': 1,
            'work-from-home': 1,
            'business-trip': 1,
            'holiday': 1,
            'leave': 0,
            'absent': 0,
        };

        // Map dates to status for quick lookup
        const attendanceMap = new Map();
        attendanceRecords.forEach(record => {
            attendanceMap.set(record.date.toISOString().slice(0, 10), record.status);
        });

        let totalPaidDays = 0;

        // Today’s date for reference
        const today = new Date();
        const todayStr = today.toISOString().slice(0, 10);

        // Calculate pay days considering missing status after day is over as leave/absent (0 pay)
        for (let day = 1; day <= lastDayOfMonth; day++) {
            const dateStr = new Date(yearNum, monthNum - 1, day).toISOString().slice(0, 10);

            if (dateStr > todayStr) {
                // Future date - ignore from payroll calculation
                continue;
            }

            const status = attendanceMap.get(dateStr);
            if (!status) {
                // No attendance status after day has passed means absent/leave (0 pay)
                totalPaidDays += 0;
            } else {
                totalPaidDays += statusToPay[status] ?? 0;
            }
        }

        const payableSalary = ((salary / totalWorkingDays) * totalPaidDays).toFixed(2);

        res.json({
            employeeCode: employee.employeeCode,
            employeeName: employee.name,
            month,
            year,
            totalWorkingDays,
            totalPaidDays,
            payableSalary,
        });
    } catch (error) {
        console.error('Error generating payroll:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


exports.getAllMonthlyPayrolls = async (req, res) => {
    try {
        const { year, month } = req.query;
        if (!year || !month) {
            return res.status(400).json({ message: 'year and month are required' });
        }

        const yearNum = parseInt(year, 10);
        const monthNum = parseInt(month, 10);

        const employees = await Employee.find();
        const results = [];

        const lastDayOfMonth = new Date(yearNum, monthNum, 0).getDate();
        const sundays = getSundays(yearNum, monthNum);
        const totalWorkingDays = lastDayOfMonth - sundays;

        // Today’s date for ignoring future days in payroll
        const today = new Date();
        const todayStr = today.toISOString().slice(0, 10);

        for (const employee of employees) {
            const salary = parseFloat(employee.salary);

            // Fetch attendance records with Date objects for date filter
            const attendanceRecords = await Attendance.find({
                employeeCode: employee.employeeCode,
                date: {
                    $gte: new Date(yearNum, monthNum - 1, 1),
                    $lte: new Date(yearNum, monthNum - 1, lastDayOfMonth),
                },
            });

            const statusToPay = {
                'full-day': 1,
                'half-day': 0.5,
                'paid-leave': 1,
                'sick-leave': 1,
                'work-from-home': 1,
                'business-trip': 1,
                'holiday': 1,
                'leave': 0,
                'absent': 0,
            };

            const attendanceMap = new Map();

            // Safely convert record.date to Date before using toISOString()
            attendanceRecords.forEach(record => {
                let recordDateObj = record.date;
                if (!(recordDateObj instanceof Date)) {
                    recordDateObj = new Date(record.date);
                }
                if (!isNaN(recordDateObj.getTime())) {
                    attendanceMap.set(recordDateObj.toISOString().slice(0, 10), record.status);
                } else {
                    console.warn('Invalid date in attendance record:', record.date);
                }
            });

            let totalPaidDays = 0;

            for (let day = 1; day <= lastDayOfMonth; day++) {
                const dateStr = new Date(yearNum, monthNum - 1, day).toISOString().slice(0, 10);

                if (dateStr > todayStr) {
                    // Future day, ignore
                    continue;
                }

                const status = attendanceMap.get(dateStr);
                if (!status) {
                    totalPaidDays += 0; // Absent/leave
                } else {
                    totalPaidDays += statusToPay[status] ?? 0;
                }
            }

            const payableSalary = ((salary / totalWorkingDays) * totalPaidDays).toFixed(2);

            results.push({
                employeeCode: employee.employeeCode,
                employeeName: employee.name,
                month,
                year,
                totalWorkingDays,
                totalPaidDays,
                payableSalary,
            });
        }

        res.json(results);
    } catch (error) {
        console.error('Error getting payroll for all employees:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

