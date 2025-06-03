import React, { useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";

dayjs.extend(isoWeek);

const BulkAttendance = () => {
    const [employees, setEmployees] = useState([]);
    const [selectedDate, setSelectedDate] = useState(dayjs().format("YYYY-MM-DD"));
    const [attendanceData, setAttendanceData] = useState({});

    // Helper: Check if date is future compared to today
    const isFutureDate = (date) => dayjs(date).isAfter(dayjs(), 'day');

    // Get start and end of week (Monday - Sunday) using isoWeek plugin
    const getWeekRange = (dateStr) => {
        const date = dayjs(dateStr);
        const startOfWeek = date.startOf("isoWeek");  // Monday
        const endOfWeek = date.endOf("isoWeek");      // Sunday
        return { startDate: startOfWeek.format("YYYY-MM-DD"), endDate: endOfWeek.format("YYYY-MM-DD") };
    };

    const weekDates = () => {
        const { startDate } = getWeekRange(selectedDate);
        return Array.from({ length: 7 }).map((_, i) => dayjs(startDate).add(i, "day").format("YYYY-MM-DD"));
    };

    useEffect(() => {
        axios.get("http://localhost:5000/api/employees")
            .then((res) => {
                const data = Array.isArray(res.data) ? res.data : res.data.employees || [];
                setEmployees(data);
            })
            .catch(console.error);
    }, []);

    useEffect(() => {
        if (employees.length === 0) return;
        const { startDate, endDate } = getWeekRange(selectedDate);

        employees.forEach(emp => {
            axios.get(`http://localhost:5000/api/attendance/employee/${emp.employeeId}/week`, {
                params: { startDate, endDate }
            })
                .then((res) => {
                    const employeeRecords = res.data.attendance;
                    setAttendanceData(prev => ({
                        ...prev,
                        [emp.employeeId]: employeeRecords.reduce((map, record) => {
                            map[record.date] = record.status;
                            return map;
                        }, {})
                    }));
                })
                .catch(console.error);
        });
    }, [selectedDate, employees]);

    const handleAttendanceChange = (employeeId, date, status) => {
        setAttendanceData(prev => ({
            ...prev,
            [employeeId]: {
                ...(prev[employeeId] || {}),
                [date]: status
            }
        }));

        axios.put("http://localhost:5000/api/attendance/update", {
            employeeId,
            date,
            status
        }).catch(console.error);
    };

    const handleWeekChange = (direction) => {
        const newDate = dayjs(selectedDate).add(direction * 7, "day").format("YYYY-MM-DD");
        setSelectedDate(newDate);
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold">Weekly Attendance</h1>
                <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="border rounded px-2 py-1"
                />
            </div>

            <div className="flex justify-between mb-4">
                <button onClick={() => handleWeekChange(-1)} className="bg-gray-300 px-4 py-2 rounded">Previous Week</button>
                <button onClick={() => handleWeekChange(1)} className="bg-gray-300 px-4 py-2 rounded">Next Week</button>
            </div>

            <table className="w-full border border-gray-300">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="border px-4 py-2">#</th>
                        <th className="border px-4 py-2">Full Name</th>
                        <th className="border px-4 py-2">Employee ID</th>
                        {weekDates().map(date => (
                            <th key={date} className="border px-4 py-2">
                                {dayjs(date).format("ddd D MMM")}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {employees.map((emp, idx) => (
                        <tr key={emp.employeeId}>
                            <td className="border px-4 py-2">{idx + 1}</td>
                            <td className="border px-4 py-2">{emp.fullName}</td>
                            <td className="border px-4 py-2">{emp.employeeId}</td>
                            {weekDates().map(date => (
                                <td key={date} className="border px-2 py-1">
                                    <select
                                        value={attendanceData[emp.employeeId]?.[date] || ""}
                                        onChange={(e) =>
                                            handleAttendanceChange(emp.employeeId, date, e.target.value)
                                        }
                                        className={`border rounded px-1 py-0.5 w-full
        ${isFutureDate(date) ? "bg-gray-100 cursor-not-allowed opacity-70" : ""}`}
                                        disabled={isFutureDate(date)}  // disable future dates
                                        title={isFutureDate(date) ? "Cannot update future dates" : ""}
                                    >
                                        <option value="">--</option>
                                        <option value="present">Present</option>
                                        <option value="absent">Absent</option>
                                        <option value="half-day">Half-Day</option>
                                        <option value="leave">Leave</option>
                                    </select>
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default BulkAttendance;
