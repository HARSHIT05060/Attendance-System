import React, { useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";

dayjs.extend(isoWeek);

// Attendance options with labels and colors
const attendanceOptions = [
    { value: "", label: "Select", className: "text-slate-500" },
    { value: "full-day", label: "Full Day", className: "text-emerald-600" },
    { value: "half-day", label: "Half Day", className: "text-amber-600" },
    { value: "leave", label: "Leave", className: "text-red-600" },
    { value: "paid-leave", label: "Paid Leave", className: "text-violet-600" },
    { value: "sick-leave", label: "Sick Leave", className: "text-pink-600" },
    { value: "work-from-home", label: "Work From Home", className: "text-blue-600" },
    { value: "holiday", label: "Holiday", className: "text-teal-600" },
    { value: "business-trip", label: "Business Trip", className: "text-orange-600" },
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
}

export default function BulkAttendance() {
    const [employees, setEmployees] = useState([]);
    const [selectedDate, setSelectedDate] = useState(dayjs().format("YYYY-MM-DD"));
    const [attendanceData, setAttendanceData] = useState({}); 
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
                            `${API_BASE_URL}/api/attendance/employee/${emp.employeeCode}/week`,
                            { params: { startDate, endDate } }
                        );
                        // Convert array of records to {date: status} map
                        const records = res.data.attendance || [];
                        newAttendance[emp.employeeCode] = records.reduce((acc, rec) => {
                            // Ensure date is in YYYY-MM-DD format
                            let dateKey = rec.date;
                            if (rec.date && typeof rec.date === 'string' && rec.date.includes('T')) {
                                // If date comes as ISO string, extract YYYY-MM-DD part
                                dateKey = rec.date.split('T')[0];
                            } else if (rec.date && rec.date instanceof Date) {
                                // If date comes as Date object, convert to YYYY-MM-DD
                                dateKey = rec.date.toISOString().split('T')[0];
                            } else if (rec.date && typeof rec.date === 'string' && rec.date.includes('-')) {
                                // If already in YYYY-MM-DD format, use as is
                                dateKey = rec.date;
                            }

                            acc[dateKey] = rec.status;
                            return acc;
                        }, {});
                    } catch (err) {
                        console.error(`Failed to fetch attendance for ${emp.employeeCode}`, err);
                        newAttendance[emp.employeeCode] = {};
                    }
                })
            );

            console.log('Fetched attendance data:', newAttendance); // Debug log
            setAttendanceData(newAttendance);
            setOriginalAttendanceData(JSON.parse(JSON.stringify(newAttendance))); // Deep clone
            setIsChanged(false);
        };

        fetchAttendance();
    }, [selectedDate, employees]);

    // Detect changes (deep compare)
    useEffect(() => {
        setIsChanged(JSON.stringify(attendanceData) !== JSON.stringify(originalAttendanceData));
    }, [attendanceData, originalAttendanceData]);

    // Update attendance on select change
    const handleAttendanceChange = (employeeCode, date, value) => {
        if (isFutureDate(date)) return; // don't allow future edits
        setAttendanceData((prev) => ({
            ...prev,
            [employeeCode]: {
                ...prev[employeeCode],
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
                    if (newStatus !== oldStatus && newStatus !== "") {
                        // Ensure date is in proper format before sending
                        const formattedDate = dayjs(date).format('YYYY-MM-DD');
                        updates.push({
                            employeeCode: empId,
                            date: formattedDate,
                            status: newStatus
                        });
                    }
                }
            }

            console.log('Sending updates:', updates); // Debug log

            // Make parallel API calls
            await Promise.all(
                updates.map(({ employeeCode, date, status }) =>
                    axios.put(`${API_BASE_URL}/api/attendance/update`, {
                        employeeCode,
                        date,
                        status,
                    })
                )
            );

            setOriginalAttendanceData(JSON.parse(JSON.stringify(attendanceData))); // Deep clone
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
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40">
            {/* Notification */}
            {notification && (
                <div className={`fixed top-6 right-6 z-50 px-6 py-4 rounded-xl shadow-xl border max-w-sm backdrop-blur-sm ${notification.type === 'success'
                    ? 'bg-emerald-50/90 border-emerald-200 text-emerald-800'
                    : 'bg-red-50/90 border-red-200 text-red-800'
                    } transform transition-all duration-500 ease-out animate-in slide-in-from-right-full`}>
                    <div className="flex items-start gap-3">
                        {notification.type === 'success' ? (
                            <div className="flex-shrink-0 w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center">
                                <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                        ) : (
                            <div className="flex-shrink-0 w-6 h-6 bg-red-100 rounded-full flex items-center justify-center">
                                <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </div>
                        )}
                        <div className="flex-1">
                            <p className="font-semibold text-sm leading-tight">{notification.message}</p>
                        </div>
                        <button
                            onClick={() => setNotification(null)}
                            className="flex-shrink-0 text-slate-400 hover:text-slate-600 transition-colors"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>
            )}

            <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8 max-w-full">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                        </div>
                        <div>
                            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                                Weekly Attendance
                            </h1>
                            <p className="text-slate-600 text-sm sm:text-base lg:text-lg mt-1 font-medium">
                                Manage team attendance efficiently
                            </p>
                        </div>
                    </div>
                </div>

                {/* Navigation Controls */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-6 mb-8">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => changeWeek(-1)}
                                    className="group flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-slate-100 to-slate-50 hover:from-slate-200 hover:to-slate-100 text-slate-700 rounded-xl border border-slate-200 transition-all duration-300 hover:shadow-md font-semibold text-sm hover:scale-105 active:scale-95"
                                    aria-label="Previous Week"
                                >
                                    <svg className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                                    </svg>
                                    <span>Previous</span>
                                </button>

                                <button
                                    onClick={() => changeWeek(1)}
                                    className="group flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-slate-100 to-slate-50 hover:from-slate-200 hover:to-slate-100 text-slate-700 rounded-xl border border-slate-200 transition-all duration-300 hover:shadow-md font-semibold text-sm hover:scale-105 active:scale-95"
                                    aria-label="Next Week"
                                >
                                    <span>Next</span>
                                    <svg className="w-4 h-4 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                            </div>

                            <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 rounded-xl border border-slate-200">
                                <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <label htmlFor="date-picker" className="text-sm font-semibold text-slate-700">
                                    Jump to:
                                </label>
                                <input
                                    id="date-picker"
                                    type="date"
                                    value={selectedDate}
                                    onChange={(e) => setSelectedDate(e.target.value)}
                                    className="px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all duration-200 text-sm font-medium"
                                    aria-label="Select date to change week"
                                />
                            </div>
                        </div>

                        <div className="text-sm text-slate-600 bg-slate-50 px-4 py-2 rounded-lg border border-slate-200">
                            <span className="font-semibold">Week:</span> {dayjs(weekDates[0]).format("MMM D")} - {dayjs(weekDates[6]).format("MMM D, YYYY")}
                        </div>
                    </div>
                </div>

                {/* Attendance Table */}
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gradient-to-r from-slate-100/90 to-slate-50/90 border-b border-slate-200">
                                    <th className="text-left px-6 py-5 font-bold text-slate-800 sticky left-0 bg-slate-100/90 z-10 min-w-[220px] border-r border-slate-200">
                                        <div className="flex items-center gap-2">
                                            <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                            Employee
                                        </div>
                                    </th>
                                    {weekDates.map((date) => {
                                        const isToday = dayjs(date).isSame(dayjs(), 'day');
                                        const isWeekend = dayjs(date).day() === 0 || dayjs(date).day() === 6;
                                        return (
                                            <th key={date} className={`px-3 py-5 text-center border-r border-slate-200 last:border-r-0 min-w-[160px] ${isToday ? 'bg-blue-100/70' : ''} ${isWeekend ? 'bg-orange-50/70' : ''}`}>
                                                <div className="space-y-2">
                                                    <div className={`font-bold text-base ${isToday ? 'text-blue-800' : 'text-slate-800'}`}>
                                                        {dayjs(date).format("ddd")}
                                                    </div>
                                                    <div className={`text-sm ${isToday ? 'text-blue-600' : 'text-slate-600'} font-medium`}>
                                                        {dayjs(date).format("DD MMM")}
                                                    </div>
                                                    {isToday && (
                                                        <div className="flex justify-center">
                                                            <div className="w-2 h-2 bg-blue-500 rounded-full shadow-sm"></div>
                                                        </div>
                                                    )}
                                                    {isWeekend && (
                                                        <div className="text-xs text-orange-600 font-medium bg-orange-100 px-2 py-1 rounded-full">
                                                            Weekend
                                                        </div>
                                                    )}
                                                </div>
                                            </th>
                                        );
                                    })}
                                </tr>
                            </thead>
                            <tbody>
                                {employees.length === 0 && (
                                    <tr>
                                        <td colSpan={8} className="text-center py-20">
                                            <div className="flex flex-col items-center gap-4">
                                                <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                                                <div className="space-y-2">
                                                    <div className="text-slate-600 font-semibold">Loading employees...</div>
                                                    <div className="text-slate-500 text-sm">Please wait while we fetch the data</div>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                )}

                                {employees.map((emp, index) => (
                                    <tr
                                        key={emp.employeeCode}
                                        className={`border-b border-slate-100 hover:bg-blue-50/30 transition-all duration-200 ${index % 2 === 0 ? 'bg-white/50' : 'bg-slate-25/50'} group`}
                                    >
                                        {/* Employee Info */}
                                        <td className="px-6 py-5 font-medium text-slate-800 sticky left-0 bg-inherit z-10 border-r border-slate-200 group-hover:bg-blue-50/30">
                                            <div className="flex items-center gap-4">
                                                <div className="relative">
                                                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-md">
                                                        {(emp.name || emp.employeeCode).charAt(0).toUpperCase()}
                                                    </div>
                                                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white"></div>
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <div className="font-bold text-slate-900 truncate">{emp.employeeCode}</div>
                                                    <div className="text-sm text-slate-600 truncate">{emp.name || "Unnamed"}</div>
                                                    <div className="text-xs text-slate-500 truncate">{emp.department || "No Department"}</div>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Attendance Columns */}
                                        {weekDates.map((date) => {
                                            const status = attendanceData[emp.employeeCode]?.[date] || "";
                                            const disabled = isFutureDate(date);
                                            const isToday = dayjs(date).isSame(dayjs(), 'day');
                                            const isWeekend = dayjs(date).day() === 0 || dayjs(date).day() === 6;

                                            return (
                                                <td
                                                    key={date}
                                                    className={`px-3 py-5 text-center border-r border-slate-100 last:border-r-0 group-hover:bg-blue-50/30
                        ${isToday ? 'bg-blue-50/50' : ''} ${isWeekend ? 'bg-orange-50/30' : ''}`}
                                                >
                                                    <select
                                                        value={status}
                                                        disabled={disabled}
                                                        onChange={(e) =>
                                                            handleAttendanceChange(emp.employeeCode, date, e.target.value)
                                                        }
                                                        className={`w-full px-3 py-2.5 text-sm rounded-xl border-2 transition-all duration-200 font-semibold shadow-sm hover:shadow-md focus:shadow-lg
                                ${disabled
                                                                ? "bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed"
                                                                : "bg-white border-slate-300 hover:border-blue-400 focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 cursor-pointer transform hover:scale-105 focus:scale-105"
                                                            } 
                                ${status ? attendanceOptions.find(opt => opt.value === status)?.className || 'text-slate-700' : 'text-slate-500'
                                                            }`}
                                                        style={{ minWidth: 130 }}
                                                        aria-label={`Attendance for ${emp.name || emp.employeeCode} on ${date}`}
                                                    >
                                                        {attendanceOptions.map(({ value, label, className }) => (
                                                            <option key={value || "default"} value={value} className={className}>
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
                <div className="mt-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                    <div className="flex items-center gap-4">
                        {isChanged && (
                            <div className="flex items-center gap-3 text-amber-700 bg-amber-50 px-4 py-3 rounded-xl border border-amber-200 shadow-sm">
                                <div className="w-5 h-5 bg-amber-100 rounded-full flex items-center justify-center">
                                    <svg className="w-3 h-3 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 9v2m0 4h.01" />
                                    </svg>
                                </div>
                                <span className="text-sm font-semibold">You have unsaved changes</span>
                            </div>
                        )}
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={handleSave}
                            disabled={!isChanged || isSaving}
                            className={`group relative px-8 py-4 rounded-xl font-bold text-white transition-all duration-300 min-w-[160px] text-sm tracking-wide overflow-hidden ${isChanged && !isSaving
                                ? "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
                                : "bg-slate-400 cursor-not-allowed"
                                }`}
                        >
                            <div className={`absolute inset-0 bg-gradient-to-r from-blue-700 to-indigo-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                            <div className="relative z-10">
                                {isSaving ? (
                                    <div className="flex items-center justify-center gap-3">
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        <span>Saving...</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center gap-2">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span>Save Changes</span>
                                    </div>
                                )}
                            </div>
                        </button>
                    </div>
                </div>

                {/* Summary Stats */}
                <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/50 text-center">
                        <div className="text-2xl font-bold text-slate-800">{employees.length}</div>
                        <div className="text-sm text-slate-600 font-medium">Total Employees</div>
                    </div>
                    <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/50 text-center">
                        <div className="text-2xl font-bold text-blue-600">7</div>
                        <div className="text-sm text-slate-600 font-medium">Days in Week</div>
                    </div>
                    <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/50 text-center">
                        <div className="text-2xl font-bold text-emerald-600">
                            {Object.values(attendanceData).reduce((acc, emp) =>
                                acc + Object.values(emp).filter(status => status === 'full-day').length, 0
                            )}
                        </div>
                        <div className="text-sm text-slate-600 font-medium">Full Days</div>
                    </div>
                    <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/50 text-center">
                        <div className="text-2xl font-bold text-red-600">
                            {Object.values(attendanceData).reduce((acc, emp) =>
                                acc + Object.values(emp).filter(status => status === 'leave').length, 0
                            )}
                        </div>
                        <div className="text-sm text-slate-600 font-medium">Leaves</div>
                    </div>
                </div>
            </div>
        </div>
    )
};