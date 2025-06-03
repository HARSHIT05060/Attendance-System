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
                filter: { employeeId: record.employeeId, date: formatDate(record.date) },
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
        const { employeeId } = req.params;
        const { startDate, endDate } = req.query;

        if (!startDate || !endDate) {
            return res.status(400).json({ message: "Start and end dates are required" });
        }

        // Format dates for string comparison
        const start = formatDate(startDate);
        const end = formatDate(endDate);

        const attendanceRecords = await Attendance.find({
            employeeId,
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
        const { employeeId, date, status } = req.body;

        if (!employeeId || !date || !status) {
            return res.status(400).json({ message: "employeeId, date, and status are required" });
        }

        const formattedDate = formatDate(date);

        const updated = await Attendance.findOneAndUpdate(
            { employeeId, date: formattedDate },
            { $set: { status } },
            { upsert: true, new: true }
        );

        res.status(200).json({ message: "Attendance updated", record: updated });
    } catch (error) {
        console.error("Error updating attendance:", error.stack || error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

module.exports = {
    bulkAttendance,
    getAttendanceByWeek,
    updateAttendance,
};
