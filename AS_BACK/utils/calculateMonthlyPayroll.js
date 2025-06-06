// utils/calculateMonthlyPayroll.js

const Employee = require('../models/Employee');
const Attendance = require('../models/Attendance');

const attendanceSalaryMultiplier = {
    "full-day": 1,
    "half-day": 0.5,
    "leave": 0,
    "paid-leave": 1,
    "sick-leave": 1,
    "work-from-home": 1,
    "holiday": 1,
    "business-trip": 1
};

async function calculateMonthlyPayroll(employeeId, year, month) {
    // Find employee
    const employee = await Employee.findOne({ employeeId });
    if (!employee) throw new Error('Employee not found');

    // Fetch attendance records for the month and year
    // Date format: "dd-mm-yyyy", we filter by '-MM-YYYY' pattern
    const monthStr = String(month).padStart(2, '0');
    const dateRegex = new RegExp(`-` + monthStr + `-` + year + `$`);

    const attendanceRecords = await Attendance.find({
        employeeId,
        date: { $regex: dateRegex }
    });

    const totalWorkingDays = 22; // You can customize this value

    // Calculate total paid days using multiplier
    let totalPaidDays = 0;
    attendanceRecords.forEach(record => {
        const multiplier = attendanceSalaryMultiplier[record.status] || 0;
        totalPaidDays += multiplier;
    });

    const monthlySalary = Number(employee.salary);

    const payableSalary = (monthlySalary / totalWorkingDays) * totalPaidDays;

    return {
        employeeId,
        employeeName: employee.fullName,
        month,
        year,
        totalWorkingDays,
        totalPaidDays,
        payableSalary: payableSalary.toFixed(2)
    };
}

module.exports = calculateMonthlyPayroll;
