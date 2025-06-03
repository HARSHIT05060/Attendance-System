import React, { useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";

dayjs.extend(isoWeek);

const isFutureDate = (date) => dayjs(date).isAfter(dayjs(), "day");

const getWeekRange = (dateStr) => {
    const date = dayjs(dateStr);
    const startOfWeek = date.startOf("isoWeek");
    const endOfWeek = date.endOf("isoWeek");
    return {
        startDate: startOfWeek.format("YYYY-MM-DD"),
        endDate: endOfWeek.format("YYYY-MM-DD"),
    };
};

const weekDates = (selectedDate) => {
    const { startDate } = getWeekRange(selectedDate);
    return Array.from({ length: 7 }).map((_, i) =>
        dayjs(startDate).add(i, "day").format("YYYY-MM-DD")
    );
};

const API_BASE_URL =
    import.meta.env.MODE === "development"
        ? import.meta.env.VITE_API_URL_LOCAL
        : import.meta.env.VITE_API_URL_PROD;

const BulkAttendance = () => {
    const [employees, setEmployees] = useState([]);
    const [selectedDate, setSelectedDate] = useState(dayjs().format("YYYY-MM-DD"));
    const [attendanceData, setAttendanceData] = useState({});
    const [originalAttendanceData, setOriginalAttendanceData] = useState({});
    const [isChanged, setIsChanged] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const res = await axios.get(`${API_BASE_URL}/api/employees`);
                const data = Array.isArray(res.data) ? res.data : res.data.employees || [];
                setEmployees(data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchEmployees();
    }, []);

    useEffect(() => {
        if (employees.length === 0) return;

        const fetchAttendance = async () => {
            const { startDate, endDate } = getWeekRange(selectedDate);
            const newAttendanceData = {};

            await Promise.all(
                employees.map(async (emp) => {
                    try {
                        const res = await axios.get(
                            `${API_BASE_URL}/api/attendance/employee/${emp.employeeId}/week`,
                            { params: { startDate, endDate } }
                        );
                        const employeeRecords = res.data.attendance;
                        newAttendanceData[emp.employeeId] = employeeRecords.reduce((map, record) => {
                            map[record.date] = record.status;
                            return map;
                        }, {});
                    } catch (err) {
                        console.error(err);
                        newAttendanceData[emp.employeeId] = {};
                    }
                })
            );

            setAttendanceData(newAttendanceData);
            setOriginalAttendanceData(newAttendanceData);
            setIsChanged(false);
        };

        fetchAttendance();
    }, [selectedDate, employees]);

    // Check if attendanceData differs from originalAttendanceData
    useEffect(() => {
        const changed = JSON.stringify(attendanceData) !== JSON.stringify(originalAttendanceData);
        setIsChanged(changed);
    }, [attendanceData, originalAttendanceData]);

    const handleAttendanceChange = (employeeId, date, status) => {
        setAttendanceData((prev) => ({
            ...prev,
            [employeeId]: {
                ...(prev[employeeId] || {}),
                [date]: status,
            },
        }));
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            const updates = [];

            for (const empId in attendanceData) {
                for (const date in attendanceData[empId]) {
                    const currentStatus = attendanceData[empId][date];
                    const originalStatus = originalAttendanceData[empId]?.[date] || "";

                    if (currentStatus !== originalStatus) {
                        updates.push({ employeeId: empId, date, status: currentStatus });
                    }
                }
            }

            await Promise.all(
                updates.map(({ employeeId, date, status }) =>
                    axios.put(`${API_BASE_URL}/api/attendance/update`, {
                        employeeId,
                        date,
                        status,
                    })
                )
            );

            setOriginalAttendanceData({ ...attendanceData });
            setIsChanged(false);
        } catch (error) {
            console.error("Failed to update attendance", error);
            // optionally show user feedback here
        }
        setIsSubmitting(false);
    };

    const handleWeekChange = (direction) => {
        const newDate = dayjs(selectedDate).add(direction * 7, "day").format("YYYY-MM-DD");
        setSelectedDate(newDate);
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold">Bulk Attendance</h1>
                <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="border rounded px-2 py-1"
                />
            </div>

            <div className="flex justify-between mb-4 items-center space-x-2">
                <div>
                    <button
                        onClick={() => handleWeekChange(-1)}
                        className="bg-gray-300 px-4 py-2 rounded"
                        disabled={isSubmitting}
                    >
                        Previous Week
                    </button>
                    <button
                        onClick={() => handleWeekChange(1)}
                        className="bg-gray-300 px-4 py-2 rounded ml-2"
                        disabled={isSubmitting}
                    >
                        Next Week
                    </button>
                </div>

                <button
                    onClick={handleSubmit}
                    disabled={!isChanged || isSubmitting}
                    className={`px-4 py-2 rounded font-semibold text-white ${isChanged ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-400 cursor-not-allowed"
                        }`}
                >
                    {isSubmitting ? "Submitting..." : "Submit Changes"}
                </button>
            </div>

            <table className="w-full border border-gray-300">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="border px-4 py-2">#</th>
                        <th className="border px-4 py-2">Full Name</th>
                        <th className="border px-4 py-2">Employee ID</th>
                        {weekDates(selectedDate).map((date) => (
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
                            {weekDates(selectedDate).map((date) => (
                                <td key={date} className="border px-2 py-1">
                                    <select
                                        value={attendanceData[emp.employeeId]?.[date] || ""}
                                        onChange={(e) =>
                                            handleAttendanceChange(emp.employeeId, date, e.target.value)
                                        }
                                        className={`border rounded px-1 py-0.5 w-full ${isFutureDate(date) ? "bg-gray-100 cursor-not-allowed opacity-70" : ""
                                            }`}
                                        disabled={isFutureDate(date) || isSubmitting}
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
