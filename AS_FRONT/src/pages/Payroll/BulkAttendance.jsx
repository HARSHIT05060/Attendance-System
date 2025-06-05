import React, { useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";

dayjs.extend(isoWeek);

// Attendance options with labels and colors
const attendanceOptions = [
    { value: "", label: "Select", className: "text-gray-500" },
    { value: "full-day", label: "Full Day", className: "text-emerald-700" },
    { value: "half-day", label: "Half Day", className: "text-amber-700" },
    { value: "leave", label: "Leave", className: "text-red-700" },
    { value: "paid-leave", label: "Paid Leave", className: "text-purple-700" },
    { value: "sick-leave", label: "Sick Leave", className: "text-pink-700" },
    { value: "work-from-home", label: "Work From Home", className: "text-blue-700" },
    { value: "holiday", label: "Holiday", className: "text-teal-700" },
    { value: "business-trip", label: "Business Trip", className: "text-orange-700" },
];

// API base URL depending on environment
const API_BASE_URL =
    import.meta.env.MODE === "development"
        ? import.meta.env.VITE_API_URL_LOCAL
        : import.meta.env.VITE_API_URL_PROD;

// Helper: check if date is in the future (disable editing)
const isFutureDate = (date) => dayjs(date).isAfter(dayjs(), "day");

// Get week start (Monday) and end (Sunday) from selected date
const getWeekRange = (dateStr) => {
    const date = dayjs(dateStr);
    return {
        startDate: date.startOf("isoWeek").format("YYYY-MM-DD"),
        endDate: date.endOf("isoWeek").format("YYYY-MM-DD"),
    };
};

// Get array of week dates (7 days from Monday to Sunday)
const getWeekDates = (selectedDate) => {
    const { startDate } = getWeekRange(selectedDate);
    return Array.from({ length: 7 }).map((_, i) =>
        dayjs(startDate).add(i, "day").format("YYYY-MM-DD")
    );
};

export default function BulkAttendance() {
    const [employees, setEmployees] = useState([]);
    const [selectedDate, setSelectedDate] = useState(dayjs().format("YYYY-MM-DD"));
    const [attendanceData, setAttendanceData] = useState({}); // { employeeId: { date: status } }
    const [originalAttendanceData, setOriginalAttendanceData] = useState({});
    const [isChanged, setIsChanged] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [notification, setNotification] = useState(null);

    // Load employees on mount
    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const res = await axios.get(`${API_BASE_URL}/api/employees`);
                const empList = Array.isArray(res.data)
                    ? res.data
                    : res.data.employees || [];
                setEmployees(empList);
            } catch (error) {
                console.error("Error fetching employees:", error);
            }
        };
        fetchEmployees();
    }, []);

    // Load attendance data when selectedDate or employees change
    useEffect(() => {
        if (!employees.length) return;

        const fetchAttendance = async () => {
            const { startDate, endDate } = getWeekRange(selectedDate);
            const newAttendance = {};

            await Promise.all(
                employees.map(async (emp) => {
                    try {
                        const res = await axios.get(
                            `${API_BASE_URL}/api/attendance/employee/${emp.employeeId}/week`,
                            { params: { startDate, endDate } }
                        );
                        // Convert array of records to {date: status} map
                        const records = res.data.attendance || [];
                        newAttendance[emp.employeeId] = records.reduce((acc, rec) => {
                            acc[rec.date] = rec.status;
                            return acc;
                        }, {});
                    } catch (err) {
                        console.error(`Failed to fetch attendance for ${emp.employeeId}`, err);
                        newAttendance[emp.employeeId] = {};
                    }
                })
            );

            setAttendanceData(newAttendance);
            setOriginalAttendanceData(newAttendance);
            setIsChanged(false);
        };

        fetchAttendance();
    }, [selectedDate, employees]);

    // Detect changes (deep compare)
    useEffect(() => {
        setIsChanged(JSON.stringify(attendanceData) !== JSON.stringify(originalAttendanceData));
    }, [attendanceData, originalAttendanceData]);

    // Update attendance on select change
    const handleAttendanceChange = (employeeId, date, value) => {
        if (isFutureDate(date)) return; // don't allow future edits
        setAttendanceData((prev) => ({
            ...prev,
            [employeeId]: {
                ...prev[employeeId],
                [date]: value,
            },
        }));
    };

    // Save changed attendance to backend
    const handleSave = async () => {
        setIsSaving(true);
        try {
            const updates = [];

            for (const empId in attendanceData) {
                for (const date in attendanceData[empId]) {
                    const newStatus = attendanceData[empId][date];
                    const oldStatus = originalAttendanceData[empId]?.[date] || "";
                    if (newStatus !== oldStatus) {
                        updates.push({ employeeId: empId, date, status: newStatus });
                    }
                }
            }

            // Make parallel API calls
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
            setNotification({ type: 'success', message: 'Attendance updated successfully!' });
        } catch (error) {
            console.error("Failed to save attendance:", error);
            setNotification({ type: 'error', message: 'Failed to update attendance. Please try again.' });
        } finally {
            setIsSaving(false);
        }
    };

    // Hide notification after 5 seconds
    useEffect(() => {
        if (notification) {
            const timer = setTimeout(() => {
                setNotification(null);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [notification]);

    // Week navigation by +/- 7 days
    const changeWeek = (delta) => {
        setSelectedDate(dayjs(selectedDate).add(delta * 7, "day").format("YYYY-MM-DD"));
    };

    const weekDates = getWeekDates(selectedDate);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
            {/* Notification */}
            {notification && (
                <div className={`fixed top-4 right-4 z-50 px-6 py-4 rounded-lg shadow-lg border-l-4 max-w-sm ${notification.type === 'success'
                        ? 'bg-green-50 border-green-500 text-green-800'
                        : 'bg-red-50 border-red-500 text-red-800'
                    } transform transition-all duration-300 ease-in-out`}>
                    <div className="flex items-center gap-3">
                        {notification.type === 'success' ? (
                            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        ) : (
                            <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        )}
                        <div>
                            <p className="font-medium text-sm">{notification.message}</p>
                        </div>
                        <button
                            onClick={() => setNotification(null)}
                            className="ml-2 text-gray-400 hover:text-gray-600"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>
            )}

            <div className="container mx-auto p-4 lg:p-6 xl:p-8 max-w-7xl">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl lg:text-4xl font-bold text-slate-800 mb-2">
                        Weekly Bulk Attendance
                    </h1>
                    <p className="text-slate-600 text-sm lg:text-base">
                        Manage employee attendance for the selected week
                    </p>
                </div>

                {/* Navigation Controls */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 lg:p-6 mb-6">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => changeWeek(-1)}
                                className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg border border-slate-300 transition-all duration-200 hover:shadow-sm font-medium"
                                aria-label="Previous Week"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                                <span className="hidden sm:inline">Previous Week</span>
                            </button>

                            <button
                                onClick={() => changeWeek(1)}
                                className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg border border-slate-300 transition-all duration-200 hover:shadow-sm font-medium"
                                aria-label="Next Week"
                            >
                                <span className="hidden sm:inline">Next Week</span>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>

                        <div className="flex items-center gap-2">
                            <label htmlFor="date-picker" className="text-sm font-medium text-slate-700">
                                Jump to date:
                            </label>
                            <input
                                id="date-picker"
                                type="date"
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                                className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm"
                                aria-label="Select date to change week"
                            />
                        </div>
                    </div>
                </div>

                {/* Attendance Table */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
                                    <th className="text-left px-4 lg:px-6 py-4 font-semibold text-slate-800 sticky left-0 bg-slate-50 z-10 min-w-[200px] border-r border-slate-200">
                                        Employee
                                    </th>
                                    {weekDates.map((date) => (
                                        <th key={date} className="px-2 lg:px-3 py-4 text-center border-r border-slate-200 last:border-r-0 min-w-[140px]">
                                            <div className="font-semibold text-slate-800 text-sm lg:text-base">
                                                {dayjs(date).format("ddd")}
                                            </div>
                                            <div className="text-xs lg:text-sm text-slate-500 mt-1">
                                                {dayjs(date).format("DD MMM")}
                                            </div>
                                            {dayjs(date).isSame(dayjs(), 'day') && (
                                                <div className="inline-block w-2 h-2 bg-blue-500 rounded-full mt-1"></div>
                                            )}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {employees.length === 0 && (
                                    <tr>
                                        <td colSpan={8} className="text-center py-12">
                                            <div className="flex flex-col items-center gap-3">
                                                <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                                                <span className="text-slate-500 text-sm">Loading employees...</span>
                                            </div>
                                        </td>
                                    </tr>
                                )}

                                {employees.map((emp, index) => (
                                    <tr
                                        key={emp.employeeId}
                                        className={`border-b border-slate-100 hover:bg-slate-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-slate-25'
                                            }`}
                                    >
                                        <td className="px-4 lg:px-6 py-4 font-medium text-slate-800 sticky left-0 bg-inherit z-10 border-r border-slate-200">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                                                    {(emp.name || emp.employeeId).charAt(0).toUpperCase()}
                                                </div>
                                                <span className="text-sm lg:text-base truncate max-w-[150px]">
                                                    {emp.name || emp.employeeId}
                                                </span>
                                            </div>
                                        </td>
                                        {weekDates.map((date) => {
                                            const status = attendanceData[emp.employeeId]?.[date] || "";
                                            const disabled = isFutureDate(date);
                                            const isToday = dayjs(date).isSame(dayjs(), 'day');
                                            const isWeekend = dayjs(date).day() === 0 || dayjs(date).day() === 6;

                                            return (
                                                <td
                                                    key={date}
                                                    className={`px-2 lg:px-3 py-4 text-center border-r border-slate-100 last:border-r-0 ${isToday ? 'bg-blue-50' : ''
                                                        } ${isWeekend ? 'bg-slate-50' : ''}`}
                                                >
                                                    <select
                                                        value={status}
                                                        disabled={disabled}
                                                        onChange={(e) =>
                                                            handleAttendanceChange(emp.employeeId, date, e.target.value)
                                                        }
                                                        className={`w-full px-2 py-2 text-xs lg:text-sm rounded-lg border transition-all duration-200 font-medium ${disabled
                                                                ? "bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed"
                                                                : "bg-white border-slate-300 hover:border-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
                                                            } ${status ? attendanceOptions.find(opt => opt.value === status)?.className || 'text-slate-700' : 'text-slate-500'
                                                            }`}
                                                        style={{ minWidth: 110 }}
                                                        aria-label={`Attendance for ${emp.name || emp.employeeId} on ${date}`}
                                                    >
                                                        {attendanceOptions.map(({ value, label, className }) => (
                                                            <option
                                                                key={value || "default"}
                                                                value={value}
                                                                className={className}
                                                            >
                                                                {label}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </td>
                                            );
                                        })}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Save Button */}
                <div className="mt-8 flex flex-col sm:flex-row sm:justify-end gap-4">
                    {isChanged && (
                        <div className="flex items-center gap-2 text-amber-600 text-sm">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                            You have unsaved changes
                        </div>
                    )}

                    <button
                        onClick={handleSave}
                        disabled={!isChanged || isSaving}
                        className={`px-6 py-3 rounded-lg font-semibold text-white transition-all duration-200 min-w-[140px] ${isChanged && !isSaving
                                ? "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                                : "bg-slate-400 cursor-not-allowed"
                            }`}
                    >
                        {isSaving ? (
                            <div className="flex items-center justify-center gap-2">
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                Saving...
                            </div>
                        ) : (
                            "Save Changes"
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}