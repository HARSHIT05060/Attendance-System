const Payroll = require('../models/Payroll');
const Attendance = require('../models/Attendance');
const Employee = require('../models/Employee');

exports.generatePayroll = async (req, res) => {
    const { month } = req.body;

    try {
        const employees = await Employee.find({});
        const payrolls = [];

        for (let emp of employees) {
            const { employeeId, salary } = emp;
            const attendance = await Attendance.find({
                employeeId,
                date: {
                    $gte: new Date(`${month}-01`),
                    $lte: new Date(`${month}-31`)
                }
            });

            const presentDays = attendance.filter(a => a.status === 'present').length;
            const basicPay = (parseFloat(salary) / 30) * presentDays;

            const payroll = new Payroll({
                employeeId,
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
