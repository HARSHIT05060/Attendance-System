const Attendance = require('../models/Attendance');

// Helper: convert any date input to 'yyyy-mm-dd' string format
const formatDate = (inputDate) => {
    const d = new Date(inputDate);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${year}-${month}-${day}`;
};

const bulkAttendance = async (req, res) => {
    try {
        const attendanceRecords = req.body.attendance;
        if (!Array.isArray(attendanceRecords) || attendanceRecords.length === 0) {
            return res.status(400).json({ message: "Attendance data is required" });
        }

        // Format date and prepare bulk update ops for upsert to avoid duplicates
        const bulkOps = attendanceRecords.map(record => ({
            updateOne: {
                filter: { employeeCode: record.employeeCode, date: formatDate(record.date) },
                update: { $set: { status: record.status } },
                upsert: true,
            }
        }));

        await Attendance.bulkWrite(bulkOps);

        res.status(201).json({ message: "Bulk attendance saved/updated successfully" });
    } catch (error) {
        console.error("Error saving bulk attendance:", error.stack || error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

const getAttendanceByWeek = async (req, res) => {
    try {
        const { employeeCode } = req.params;
        const { startDate, endDate } = req.query;

        if (!startDate || !endDate) {
            return res.status(400).json({ message: "Start and end dates are required" });
        }

        // Format dates for string comparison
        const start = formatDate(startDate);
        const end = formatDate(endDate);

        const attendanceRecords = await Attendance.find({
            employeeCode,
            date: { $gte: start, $lte: end },
        });

        res.status(200).json({ attendance: attendanceRecords });
    } catch (error) {
        console.error("Error fetching weekly attendance:", error.stack || error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

const updateAttendance = async (req, res) => {
    try {
        const { employeeCode, date, status } = req.body;

        // Convert date string to Date object for MongoDB
        const dateObj = new Date(date + 'T00:00:00.000Z'); // Ensure UTC

        await Attendance.findOneAndUpdate(
            { employeeCode, date: dateObj },
            { employeeCode, date: dateObj, status },
            { upsert: true, new: true }
        );

        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    bulkAttendance,
    getAttendanceByWeek,
    updateAttendance,
};
