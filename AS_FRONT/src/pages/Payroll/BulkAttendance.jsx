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

    const getStatusColor = (status) => {
        switch (status) {
            case 'present':
                return 'bg-green-50 border-green-200 text-green-800 hover:bg-green-100';
            case 'absent':
                return 'bg-red-50 border-red-200 text-red-800 hover:bg-red-100';
            case 'half-day':
                return 'bg-yellow-50 border-yellow-200 text-yellow-800 hover:bg-yellow-100';
            case 'leave':
                return 'bg-blue-50 border-blue-200 text-blue-800 hover:bg-blue-100';
            default:
                return 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100';
        }
    };



    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-2 sm:p-4 lg:p-6">
            <div className="max-w-full mx-auto">
                {/* Header Section */}
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-3 sm:p-6 mb-4 sm:mb-6">
                    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Attendance Management</h1>
                            <p className="text-gray-600 text-sm sm:text-base">Manage weekly attendance for all employees</p>
                        </div>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full lg:w-auto">
                            <label className="text-sm font-medium text-gray-700 whitespace-nowrap">Select Date:</label>
                            <input
                                type="date"
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                                className="border border-gray-300 rounded-lg px-3 py-2 bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 w-full sm:w-auto"
                            />
                        </div>
                    </div>
                </div>

                {/* Navigation and Actions */}
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-3 sm:p-6 mb-4 sm:mb-6">
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full lg:w-auto">
                            <button
                                onClick={() => handleWeekChange(-1)}
                                className="bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-700 font-medium px-4 py-2.5 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                                disabled={isSubmitting}
                            >
                                <span className="hidden sm:inline">← Previous Week</span>
                                <span className="sm:hidden">← Prev</span>
                            </button>
                            <button
                                onClick={() => handleWeekChange(1)}
                                className="bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-700 font-medium px-4 py-2.5 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                                disabled={isSubmitting}
                            >
                                <span className="hidden sm:inline">Next Week →</span>
                                <span className="sm:hidden">Next →</span>
                            </button>
                        </div>

                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full lg:w-auto">
                            {isChanged && (
                                <div className="flex items-center gap-2 text-amber-600 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200">
                                    <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
                                    <span className="text-sm font-medium">Unsaved changes</span>
                                </div>
                            )}
                            <button
                                onClick={handleSubmit}
                                disabled={!isChanged || isSubmitting}
                                className={`px-4 sm:px-6 py-2.5 rounded-lg font-semibold text-white transition-all duration-200 shadow-md hover:shadow-lg text-sm sm:text-base w-full sm:w-auto ${isChanged && !isSubmitting
                                    ? "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transform hover:scale-105"
                                    : "bg-gray-400 cursor-not-allowed"
                                    }`}
                            >
                                {isSubmitting ? (
                                    <div className="flex items-center justify-center gap-2">
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        <span className="hidden sm:inline">Submitting...</span>
                                        <span className="sm:hidden">Saving...</span>
                                    </div>
                                ) : (
                                    <>
                                        <span className="hidden sm:inline">Save Changes</span>
                                        <span className="sm:hidden">Save</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Attendance Table */}
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-max">
                            <thead>
                                <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                                    <th className="border-r border-gray-200 px-2 sm:px-4 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-gray-700 w-12 sm:w-16">#</th>
                                    <th className="border-r border-gray-200 px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-gray-700 min-w-40 sm:min-w-48">Employee Name</th>
                                    <th className="border-r border-gray-200 px-2 sm:px-4 py-3 sm:py-4 text-center text-xs sm:text-sm font-semibold text-gray-700 w-20 sm:w-32">ID</th>
                                    {weekDates(selectedDate).map((date) => (
                                        <th key={date} className="border-r border-gray-200 px-2 sm:px-3 py-3 sm:py-4 text-center text-xs sm:text-sm font-semibold text-gray-700 min-w-24 sm:min-w-32">
                                            <div className="flex flex-col items-center">
                                                <span className="text-xs text-gray-500 uppercase tracking-wide">
                                                    {dayjs(date).format("ddd")}
                                                </span>
                                                <span className="font-bold text-gray-900 text-xs sm:text-sm">
                                                    {dayjs(date).format("D MMM")}
                                                </span>
                                            </div>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {employees.map((emp, idx) => (
                                    <tr key={emp.employeeId} className="hover:bg-gray-50 transition-colors duration-150">
                                        <td className="border-r border-gray-200 px-2 sm:px-4 py-3 sm:py-4 text-center text-xs sm:text-sm font-medium text-gray-600 bg-gray-50">
                                            {idx + 1}
                                        </td>
                                        <td className="border-r border-gray-200 px-3 sm:px-6 py-3 sm:py-4">
                                            <div className="flex items-center">
                                                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-xs sm:text-sm mr-2 sm:mr-3 flex-shrink-0">
                                                    {emp.fullName?.charAt(0)?.toUpperCase() || 'N'}
                                                </div>
                                                <span className="font-medium text-gray-900 text-xs sm:text-sm truncate">{emp.fullName}</span>
                                            </div>
                                        </td>
                                        <td className="border-r border-gray-200 px-2 sm:px-4 py-3 sm:py-4 text-center">
                                            <span className="bg-gray-100 text-gray-700 px-1 sm:px-2 py-1 rounded-md text-xs font-mono">
                                                {emp.employeeId}
                                            </span>
                                        </td>
                                        {weekDates(selectedDate).map((date) => (
                                            <td key={date} className="border-r border-gray-200 px-1 sm:px-3 py-2 sm:py-4">
                                                <div className="relative">
                                                    <select
                                                        value={attendanceData[emp.employeeId]?.[date] || ""}
                                                        onChange={(e) =>
                                                            handleAttendanceChange(emp.employeeId, date, e.target.value)
                                                        }
                                                        className={`
                                                            w-full rounded-lg px-1 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm font-medium border-2 transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:outline-none appearance-none
                                                            ${getStatusColor(attendanceData[emp.employeeId]?.[date])}
                                                            ${isFutureDate(date)
                                                                ? "opacity-50 cursor-not-allowed bg-gray-100 border-gray-200 text-gray-400"
                                                                : "cursor-pointer"
                                                            }
                                                        `}
                                                        disabled={isFutureDate(date) || isSubmitting}
                                                        title={isFutureDate(date) ? "Cannot update future dates" : ""}
                                                    >
                                                        <option value="" className="text-gray-600">Select</option>
                                                        <option value="present" className="text-green-800">Present</option>
                                                        <option value="absent" className="text-red-800">Absent</option>
                                                        <option value="half-day" className="text-yellow-800">Half Day</option>
                                                        <option value="leave" className="text-blue-800">Leave</option>
                                                    </select>

                                                    {/* Custom display for mobile */}
                                                    <div className="absolute inset-0 pointer-events-none flex items-center justify-center sm:hidden">
                                                        <span className="text-xs font-medium">
                                                            {attendanceData[emp.employeeId]?.[date] ? (
                                                                <span className="text-xs capitalize">{attendanceData[emp.employeeId]?.[date].replace('-', ' ')}</span>
                                                            ) : (
                                                                <span className="text-gray-400">-</span>
                                                            )}
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {employees.length === 0 && (
                        <div className="text-center py-8 sm:py-12">
                            <div className="text-gray-400 text-base sm:text-lg mb-2">No employees found</div>
                            <div className="text-gray-500 text-sm">Please add employees to manage attendance</div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BulkAttendance;